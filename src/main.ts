import { Line } from '../shapes/Line'
import { Circle } from '../shapes/Circle'
import { Ellipse } from '../shapes/Ellipse'
import { Polyline } from '../shapes/Polyline'

import type { Point } from '../core/types'
import type { PreviewShape } from '../core/types'

import { shapeStore } from '../core/ShapeStore'

import { scene } from '../render/scene'
import { createCamera } from '../render/camera'
import { createRenderer } from '../render/renderer'

import { toolManager } from '../core/ToolManager'

import { getMouseWorldPoint } from '../interaction/mouse'

import { createLine } from '../previewShapeGenerate/createLine'
import { createCircle } from '../previewShapeGenerate/createCircle'
import { createEllipse } from '../previewShapeGenerate/createEllipse'
import { createPolyline } from '../previewShapeGenerate/createPolyline'

import { initTheme } from '../ui/theme'
import { initGrid } from '../ui/grid'
import { initNavbar } from '../ui/navbar'
import { updateLeftPanel } from '../ui/leftPanel'
import { updateRightPanel } from '../ui/rightPanel'
import { disposeObject3D } from '../utils/dispose'

import { saveFile } from '../utils/saveFile'
import { loadFile } from '../utils/loadFile'

// Global Variables
let startPoint: Point | null = null
let isDrawing = false

let polyLinePoints: Point[] = []

// Preview Shape
let previewShape: PreviewShape | null = null

// Getting Canvas and Size
const canvas = document.querySelector('.webgl') as HTMLCanvasElement
const container = document.getElementById('canvas-container') as HTMLDivElement
const sizes = {
    width: container.clientWidth,
    height: container.clientHeight
}

// Camera Creation
const camera = createCamera(sizes.width, sizes.height)

// Renderer Creation
const renderer = createRenderer(canvas)
renderer.setSize(sizes.width, sizes.height)

const panelContent = document.getElementById('leftPanelContent')!
const panelContentR = document.getElementById('rightPanelContent')!

// Centralized UI Update Function
function updateUI() {
    updateLeftPanel(panelContent, shapeStore, scene, updateUI)
    updateRightPanel(panelContentR, shapeStore, scene, updateUI)
}

// Theme Toggle - UI
const themeToggle = document.getElementById('themeToggle') as HTMLButtonElement
if (themeToggle) {
    initTheme({
        button: themeToggle,
        scene
    })
}

// Grid View - UI
const canvasGrid = document.querySelector<SVGSVGElement>('#canvasGrid')
let grid: ReturnType<typeof initGrid> | null = null
if (
    canvasGrid &&
    container
) {
    grid = initGrid({
        svg: canvasGrid,
        container,
        sizeInput: document.getElementById('gridSize') as HTMLInputElement,
        sizeValue: document.getElementById('gridSizeValue') as HTMLInputElement,
        opacityInput: document.getElementById('gridOpacity') as HTMLInputElement,
        opacityValue: document.getElementById('gridOpacityValue') as HTMLInputElement,
        toggleButton: document.getElementById('gridToggle') as HTMLButtonElement
    })
}
grid?.updateGrid()

// Clear Button - UI
const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        const confirmed = confirm('Are you sure you want to clear all shapes? This action cannot be undone.')

        if (confirmed) {

            shapeStore.getAllShapes().forEach(shape => {
                if (shape.object3D) {
                    scene.remove(shape.object3D)
                    disposeObject3D(shape.object3D)
                }
            })
            clearPreview()
            shapeStore.shapes.clear()

            if (shapeStore.selectedShape) {
                shapeStore.selectedShapeId = null
            }

            updateUI()

            clearBtn.style.transform = 'scale(0.9)'
            setTimeout(() => {
                clearBtn.style.transform = ''
            }, 150)
        }
    })
}

// Navbar Init - UI
initNavbar({
    leftPanel: document.getElementById('leftPanel') as HTMLElement,
    rightPanel: document.getElementById('rightPanel') as HTMLElement,
    leftPanelToggle: document.getElementById('leftPanelToggle') as HTMLButtonElement,
    rightPanelToggle: document.getElementById('rightPanelToggle') as HTMLButtonElement,
    leftPanelClose: document.getElementById('leftPanelClose') as HTMLButtonElement,
    rightPanelClose: document.getElementById('rightPanelClose') as HTMLButtonElement,
    toolButtons: document.querySelectorAll<HTMLButtonElement>('.tool-btn[data-tool]'),
    onToolSelect: (tool: string) => {
        toolManager.set(tool)
    }
})

function addLine(startPoint: Point, endPoint: Point): void {
    const shape = new Line(startPoint, endPoint)
    shapeStore.add(shape)

    const mesh = shape.rebuild()
    shape.object3D = mesh
    scene.add(mesh)
    updateUI()
}

function addCircle(point: Point, radius: number) {
    const shape = new Circle(point, radius)
    shapeStore.add(shape)

    const mesh = shape.rebuild()
    shape.object3D = mesh
    scene.add(mesh)
    updateUI()
}

function addEllipse(center: Point, rx: number, ry: number) {
    const shape = new Ellipse(center, rx, ry)
    shapeStore.add(shape)

    const mesh = shape.rebuild()
    shape.object3D = mesh
    scene.add(mesh)
    updateUI()
}

function addPolyline(cords: Point[]) {
    const shape = new Polyline(cords)
    shapeStore.add(shape)

    const mesh = shape.rebuild()
    shape.object3D = mesh
    scene.add(mesh)
    updateUI()
}

// Loop Function
function animate() {
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate()


canvas.addEventListener('dblclick', (e) => {
    if (toolManager.active === 'POLYLINE') {
        addPolyline(polyLinePoints)

        if (previewShape)
            scene.remove(previewShape)

        previewShape = null
        // toolManager.set('SELECT')
        startPoint = null
        polyLinePoints = []
        clearPreview()
    }
})

// Used for Polyline
canvas.addEventListener('click', (e) => {
    if (toolManager.active === 'POLYLINE') {
        isDrawing = true
        startPoint = getMouseWorldPoint(e, canvas, camera)
        polyLinePoints.push(startPoint)
        previewShape = createPolyline(polyLinePoints)
        scene.add(previewShape)
    }
})

// Used When user clicks and holds the click
canvas.addEventListener('mousedown', (event) => {
    if (toolManager.active === 'LINE') {
        startPoint = getMouseWorldPoint(event, canvas, camera)
        isDrawing = true
    }
    else if (toolManager.active === 'CIRCLE') {
        startPoint = getMouseWorldPoint(event, canvas, camera)
        isDrawing = true
    }
    else if (toolManager.active === 'ELLIPSE') {
        startPoint = getMouseWorldPoint(event, canvas, camera)
        isDrawing = true
    }
    else if (toolManager.active === 'POLYLINE') {
        startPoint = getMouseWorldPoint(event, canvas, camera)
        isDrawing = true
    }
})

// Used When user releases the click
canvas.addEventListener('mouseup', (event) => {
    if (!isDrawing || !startPoint) return

    const endPoint = getMouseWorldPoint(event, canvas, camera)

    if (toolManager.active === 'LINE') {
        addLine(startPoint, endPoint)
    }

    if (toolManager.active === 'CIRCLE') {
        const dx = endPoint.x - startPoint.x
        const dy = endPoint.y - startPoint.y
        const radius = Math.sqrt(dx * dx + dy * dy)
        addCircle(startPoint, radius)
    }

    if (toolManager.active === 'ELLIPSE') {
        const dx = endPoint.x - startPoint.x
        const dy = endPoint.y - startPoint.y
        addEllipse(startPoint, dx, dy)
    }

    clearPreview()
    startPoint = null
    isDrawing = false
})

// Track Mouse Position while drawing
canvas.addEventListener('mousemove', (event) => {

    const worldPoint = getMouseWorldPoint(event, canvas, camera)
    const coordsDisplay = document.getElementById('canvasCoords')
    if (coordsDisplay) {
        coordsDisplay.textContent = `X: ${worldPoint.x.toFixed(2)} | Y: ${worldPoint.y.toFixed(2)}`
    }

    if (!isDrawing || !startPoint) return

    const currentPoint = getMouseWorldPoint(event, canvas, camera)
    clearPreview()

    if (toolManager.active === 'LINE') {
        previewShape = createLine(startPoint, currentPoint)
    }

    if (toolManager.active === 'CIRCLE') {
        previewShape = createCircle(startPoint, currentPoint)
    }

    if (toolManager.active === 'ELLIPSE') {
        let dx: number = Math.abs(startPoint.x - currentPoint.x)
        let dy: number = Math.abs(startPoint.y - currentPoint.y)
        previewShape = createEllipse(startPoint, dx, dy)
    }

    if (toolManager.active === 'POLYLINE' && polyLinePoints.length > 0) {
        const tempPoints = [
            ...polyLinePoints,
            currentPoint
        ]

        previewShape = createPolyline(tempPoints)
    }



    scene.add(previewShape!)
})

// Clear Preview
function clearPreview() {
    if (!previewShape) return

    scene.remove(previewShape)
    disposeObject3D(previewShape)

    previewShape = null
}

// Canvas Resize
window.addEventListener('resize', () => {
    sizes.width = container.clientWidth
    sizes.height = container.clientHeight

    const aspect = sizes.width / sizes.height

    camera.left = -10 * aspect
    camera.right = 10 * aspect
    camera.top = 10
    camera.bottom = -10
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    grid?.updateGrid()


})

updateUI()

const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        saveFile(shapeStore)
    })
}

const importBtn = document.getElementById('importBtn') as HTMLButtonElement
const importInput = document.getElementById('importInput') as HTMLInputElement

if (importBtn && importInput) {
    importBtn.addEventListener('click', () => {
        importInput.click()
    })

    importInput.addEventListener('change', () => {
        const file = importInput.files?.[0]
        if (!file) return

        loadFile(file, shapeStore, scene, () => {
            updateUI()
        })

        importInput.value = ''
    })
}