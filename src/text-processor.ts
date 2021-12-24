
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
  console.log(container);
  container.innerHTML = `
  <span id="sender" class="message-item">From: <span class="styled from">${from}</span></span>
  <span id="reciever" class="message-item">To: <span class="styled to">${to}</span></span>
  <span id="message" class="message-item">${message}</span>
  `;
}