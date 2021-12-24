
function sanitizeText(text:string){
  return text
    .replace(/>/g , "&gt;")
    .replace(/</g , "&lt;")
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function buildTagFromSearchField(container:any , search_obj:URLSearchParams){
  let from = sanitizeText(search_obj.get("from"));
  let to = sanitizeText(search_obj.get("to"));
  let message = sanitizeText(search_obj.get("m"));
  container.innerHtml = `
  <span class="sender">From: <span class="styled sender">${from}</span></span>
  <span class="reciever">To: <span class="styled reciever">${from}</span></span>
  <span class="message">${message}</span>
  `;
}