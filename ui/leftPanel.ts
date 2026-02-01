import { ShapeStore } from '../core/ShapeStore'
import * as THREE from 'three'
import { disposeObject3D } from '../utils/dispose'

let searchTerm = ''

export function updateLeftPanel(panelContent: HTMLElement, shapeStore: ShapeStore, scene: THREE.Scene, updateUI: () => void) {

    panelContent.innerHTML = ''

    // Search Bar
    const searchDiv = document.createElement('div')
    searchDiv.className = 'panel-search'
    searchDiv.innerHTML = `
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Search shapes..." value="${searchTerm}">
    `
    const searchInput = searchDiv.querySelector('input') as HTMLInputElement
    searchInput.addEventListener('input', (e) => {
        searchTerm = (e.target as HTMLInputElement).value
        updateUI()
        // Maintain focus
        const newInput = document.querySelector('.panel-search input') as HTMLInputElement
        if (newInput) {
            newInput.focus()
            newInput.setSelectionRange(newInput.value.length, newInput.value.length)
        }
    })
    panelContent.appendChild(searchDiv)

    let allShapes = shapeStore.getAllShapes()

    // Filter shapes based on search term
    if (searchTerm) {
        allShapes = allShapes.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.getType().toLowerCase().includes(searchTerm.toLowerCase())
        )
    }

    if (allShapes.length === 0) {
        const emptyState = document.createElement('div')
        emptyState.className = 'empty-state'
        emptyState.innerHTML = searchTerm ? `
            <i class="fas fa-search"></i>
            <p>No shapes match "${searchTerm}"</p>
        ` : `
            <i class="fas fa-shapes"></i>
            <p>No shapes yet.<br>Start drawing!</p>
        `
        panelContent.appendChild(emptyState)
        return
    }

    const fileDiv = document.createElement('div')
    fileDiv.className = 'shape-file'

    const fileHeader = document.createElement('div')
    fileHeader.className = 'file-header'
    fileHeader.innerHTML = `
        <div class="file-info">
            <i class="fas fa-chevron-down"></i>
            <span>My file 1</span>
        </div>
    `

    const fileShapes = document.createElement('div')
    fileShapes.className = 'file-shapes expanded'

    allShapes.forEach((shape) => {
        const shapeItem = document.createElement('div')
        shapeItem.className = 'shape-item'
        if (shapeStore.selectedShape?.id === shape.id) {
            shapeItem.classList.add('selected')
        }

        const iconMap: Record<string, string> = {
            'LINE': 'fa-minus',
            'CIRCLE': 'fa-circle',
            'ELLIPSE': 'fa-circle',
            'POLYLINE': 'fa-wave-square'
        }
        const iconClass = iconMap[shape.getType()] || 'fa-shapes'

        const eyeIconClass = shape.isHidden ? 'fa-eye-slash' : 'fa-eye'

        if (shape.id === shapeStore.selectedShapeId) {
            shapeItem.innerHTML = `
            <div class="shape-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="shape-info">
                <div class="shape-name">${shape.name}</div>
                <div class="shape-type">${shape.getType()}</div>
            </div>
            <div class="shape-actions">
                <button class="hide-action" title="${shape.isHidden ? 'Show' : 'Hide'}">
                    <i class="fas ${eyeIconClass}"></i>
                </button>
                <button class="delete-action" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        `
        }
        else {
            shapeItem.innerHTML = `
            <div class="shape-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="shape-info">
                <div class="shape-name">${shape.name}</div>
                <div class="shape-type">${shape.getType()}</div>
            </div>
        `
        }


        // Action Buttons
        const hideBtn = shapeItem.querySelector('.hide-action') as HTMLButtonElement
        const deleteBtn = shapeItem.querySelector('.delete-action') as HTMLButtonElement

        if (hideBtn) {
            hideBtn.addEventListener('click', (e) => {
                e.stopPropagation()
                shape.toggleHidden()
                shapeStore.updateSelected(scene)
                updateUI()
            })
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation()
                if (confirm(`Are you sure you want to delete ${shape.name}?`)) {
                    shapeStore.remove(shape.id)
                    if (shape.object3D) {
                        scene.remove(shape.object3D)
                        disposeObject3D(shape.object3D)
                    }
                    updateUI()
                }
            })
        }

        shapeItem.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).closest('.shape-actions')) return

            document.querySelectorAll('.shape-item').forEach(item => {
                item.classList.remove('selected')
            })

            shapeStore.select(shape.id)
            updateUI()

        })

        fileShapes.appendChild(shapeItem)
    })

    fileHeader.addEventListener('click', () => {
        fileShapes.classList.toggle('expanded')
        const icon = fileHeader.querySelector('i')
        if (icon) {
            icon.className = fileShapes.classList.contains('expanded')
                ? 'fas fa-chevron-down'
                : 'fas fa-chevron-right'
        }
    })

    fileDiv.appendChild(fileHeader)
    fileDiv.appendChild(fileShapes)
    panelContent.appendChild(fileDiv)
}
