document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault()

    const target = link.dataset.view

    document.querySelectorAll(".view").forEach(v => {
      v.classList.remove("active")
    })

    document.getElementById(target).classList.add("active")
  })
})
