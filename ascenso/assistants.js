/* Shared destinations: no prompts or personal answers are sent in URLs. */
const AscensoAssistants=(()=>{
 const all={
  chatgpt:{name:'ChatGPT',url:'https://chatgpt.com/',code:false,destination:'Pegalo en una conversación de ChatGPT.'},
  claude:{name:'Claude',url:'https://claude.ai/',code:false,destination:'Pegalo en una conversación de Claude.'},
  gemini:{name:'Gemini',url:'https://gemini.google.com/',code:false,destination:'Pegalo en una conversación de Gemini.'},
  'claude-code':{name:'Claude Code',url:null,code:true,destination:'Abrí Claude Code en tu proyecto y pegalo en su conversación.'},
  codex:{name:'Codex',url:null,code:true,destination:'Pegalo en el chat de tu proyecto en Codex.'},
  otro:{name:'Otro asistente',url:null,code:false,destination:'Abrí el asistente que usás y pegalo en una conversación.'}
 };
 function get(id){return all[id]||all.otro}
 return {all,get};
})();
if(typeof module!=='undefined')module.exports=AscensoAssistants;
