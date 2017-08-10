const search = document.querySelector('.search');
const robotsDiv = document.querySelector('.robots');

search.addEventListener('input', (event) => {
  const name = event.target.value
  fetch(`/search?name=${name}`)
    .then(response => response.text())
    .then(newHTML => {
      robotsDiv.innerHTML = newHTML;
    })
})
