import type { GridOptions } from "../core/types"

export function initGrid({
  svg,
  container,
  sizeInput,
  sizeValue,
  opacityInput,
  opacityValue,
  toggleButton
}: GridOptions) {
  let gridSize = 50
  let gridOpacity = 0.3
  let gridVisible = true

  function updateGrid() {
    const width = container.clientWidth
    const height = container.clientHeight

    svg.innerHTML = ''
    svg.setAttribute('width', `${width}`)
    svg.setAttribute('height', `${height}`)

    if (!gridVisible) {
      svg.classList.add('hidden')
      return
    }

    svg.classList.remove('hidden')
    svg.style.opacity = `${gridOpacity}`

    for (let x = 0; x <= width; x += gridSize) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', `${x}`)
      line.setAttribute('y1', '0')
      line.setAttribute('x2', `${x}`)
      line.setAttribute('y2', `${height}`)
      svg.appendChild(line)
    }

    for (let y = 0; y <= height; y += gridSize) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', '0')
      line.setAttribute('y1', `${y}`)
      line.setAttribute('x2', `${width}`)
      line.setAttribute('y2', `${y}`)
      svg.appendChild(line)
    }
  }

  sizeInput?.addEventListener('input', e => {
    if (sizeValue) {
      gridSize = +(e.target as HTMLInputElement).value
      sizeValue.textContent = `${gridSize}px`
      updateGrid()
    }

  })

  opacityInput?.addEventListener('input', e => {

    if (opacityValue) {
      gridOpacity = +(e.target as HTMLInputElement).value
      opacityValue.textContent = `${Math.round(gridOpacity * 100)}%`
      updateGrid()
    }

  })

  toggleButton?.addEventListener('click', () => {
    gridVisible = !gridVisible
    toggleButton.classList.toggle('active', gridVisible)
    updateGrid()
  })

  updateGrid()

  return { updateGrid }
}