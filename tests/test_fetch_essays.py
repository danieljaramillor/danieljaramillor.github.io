import importlib.util
import json
import pathlib
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import HTTPError, URLError

SCRIPT = pathlib.Path(__file__).resolve().parents[1] / 'scripts/fetch_essays.py'
spec = importlib.util.spec_from_file_location('sync', SCRIPT)
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)
FIXTURES = pathlib.Path(__file__).parent / 'fixtures'


def feed(pub, slug, title, body=''):
    return f'''<rss><channel><item><title>{title}</title>
    <description>Subtitle</description><link>{pub}/p/{slug}</link>
    <pubDate>Mon, 12 Oct 2026 21:15:29 GMT</pubDate>
    <content:encoded xmlns:content="http://purl.org/rss/1.0/modules/content/"><![CDATA[{body}]]></content:encoded>
    </item></channel></rss>'''


class SyncTests(unittest.TestCase):
    def setUp(self):
        self.es = (FIXTURES / 'es.xml').read_text()
        self.en = feed(sync.EN, 'small-change', 'Small Change')
        self.old = {'essays': [{'slug': 'que-pena', 'title': 'Que Pena', 'date': '2026-08-08',
                    'url': sync.ES + '/p/que-pena', 'words': 4100,
                    'en': {'slug': 'small-change', 'title': 'Small Change', 'url': sync.EN + '/p/small-change'}}],
                    'en_only': [{'slug': 'older', 'date': '2025-01-01'}]}

    def run_sync(self, responses, initial=None):
        with tempfile.TemporaryDirectory() as directory:
            out = pathlib.Path(directory) / 'essays.json'
            before = initial if initial is not None else json.dumps(self.old)
            out.write_text(before)
            with patch.object(sync, 'OUT', out), patch.object(sync, 'fetch', side_effect=responses) as fetch:
                code = sync.main()
            return code, out.read_text(), before, fetch.call_count

    def test_published_spanish_included_without_draft_translation(self):
        code, text, _, _ = self.run_sync([self.es, self.en])
        self.assertEqual(code, 0)
        data = json.loads(text)
        newest = data['essays'][0]
        self.assertEqual(newest['slug'], 'abrir-la-olla-es-facil')
        self.assertEqual(newest['url'], sync.ES + '/p/abrir-la-olla-es-facil')
        self.assertIn("conversación", newest["subtitle"])
        self.assertIsNone(newest['en'])
        self.assertNotIn('lifting-the-lid', text)
        self.assertEqual(data['essays'][1]['en']['url'], sync.EN + '/p/small-change')
        self.assertEqual(data['essays'][1]['words'], 4100)
        self.assertEqual(data['en_only'], self.old['en_only'])

    def test_denial_stops_without_fallback_or_write(self):
        for status in (401, 403, 429, 500):
            with self.subTest(status=status):
                code, after, before, calls = self.run_sync([HTTPError(sync.ES, status, 'denied', {}, None)])
                self.assertEqual((code, after, calls), (1, before, 1))

    def test_second_feed_failure_is_atomic(self):
        code, after, before, _ = self.run_sync([self.es, URLError('timeout')])
        self.assertEqual((code, after), (1, before))

    def test_malformed_empty_or_challenge_feed_fails_closed(self):
        for text in ('bad xml', '<html>Challenge</html>', '<rss><channel/></rss>', self.es.replace('Mon, 12 Oct 2026 21:15:29 GMT', 'bad date')):
            with self.subTest(text=text[:30]):
                code, after, before, _ = self.run_sync([text, self.en])
                self.assertEqual((code, after), (1, before))

    def test_corrupt_existing_file_preserved(self):
        code, after, before, calls = self.run_sync([], initial='invalid json')
        self.assertEqual((code, after, calls), (1, before, 0))

    def test_wrong_publication_or_preview_url_rejected(self):
        for text in (self.es.replace(sync.ES, sync.EN), self.es.replace('/p/abrir', '/publish/post/abrir')):
            with self.assertRaises(ValueError):
                sync.parse_feed(text, sync.ES)

    def test_deduplication_and_idempotence(self):
        posts = sync.parse_feed(self.es, sync.ES)
        english = sync.parse_feed(self.en, sync.EN)
        result = sync.merge(self.old, posts * 2, english * 2)
        self.assertEqual(len(result['essays']), 2)
        self.assertEqual(sync.merge(result, posts, english), result)
        duplicate = self.es.replace('</channel>', self.es.split('<channel>')[1].split('</channel>')[0] + '</channel>')
        self.assertEqual(len(sync.parse_feed(duplicate, sync.ES)), 1)

    def test_body_link_pairing_and_english_only(self):
        posts = sync.parse_feed(self.es, sync.ES)
        english = sync.parse_feed(feed(sync.EN, 'published-translation', 'Translation',
            sync.ES + '/p/abrir-la-olla-es-facil'), sync.EN)
        result = sync.merge({}, posts, english)
        self.assertEqual(result['essays'][0]['en']['slug'], 'published-translation')
        english[0]['body'] = ''
        result = sync.merge({}, posts, english)
        self.assertIsNone(result['essays'][0]['en'])
        self.assertEqual(len(result['en_only']), 1)

    def test_partial_feeds_retain_previous_translations(self):
        posts = sync.parse_feed(self.es, sync.ES)
        result = sync.merge(self.old, posts, [])
        self.assertEqual(result['essays'][1], self.old['essays'][0])

    def test_fetch_uses_only_public_feed(self):
        code, _, _, calls = self.run_sync([self.es, self.en])
        self.assertEqual((code, calls), (0, 2))


if __name__ == '__main__':
    unittest.main()
