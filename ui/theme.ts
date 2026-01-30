import * as THREE from 'three'

type ThemeOptions = {
  button: HTMLButtonElement
  scene: THREE.Scene
}

export function initTheme({ button, scene }: ThemeOptions) {
  let isDarkTheme = false

  function applyTheme() {
    document.body.classList.toggle('dark-theme', isDarkTheme)

    document.body.style.color = isDarkTheme ? '#ffffff' : '#000000'
    const icon = button.querySelector('i')
    if (icon) {
      icon.className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon'
    }

    scene.background = new THREE.Color(
      isDarkTheme ? '#0d1117' : '#ffffff'
    )


    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light')
  }

  function toggleTheme() {
    isDarkTheme = !isDarkTheme
    applyTheme()
  }

  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkTheme = true
    applyTheme()
  }

  button.addEventListener('click', toggleTheme)
}
