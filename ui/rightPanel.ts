import { ShapeStore } from '../core/ShapeStore'
import { Circle } from '../shapes/Circle'
import { Line } from '../shapes/Line'
import { Ellipse } from '../shapes/Ellipse'

import * as THREE from 'three'
import { disposeObject3D } from '../utils/dispose'

export function updateRightPanel(panelContent: HTMLElement, shapeStore: ShapeStore, scene: THREE.Scene, updateUI: () => void) {

    panelContent.innerHTML = ''

    const shape = shapeStore.selectedShape

    if (!shape) {
        panelContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-mouse-pointer"></i>
                <p>Select a shape to<br>view properties</p>
            </div>
        `
        return
    }

    const shapeType = shape.getType()

    if (shapeType === 'CIRCLE') {
        const circle = shape as Circle
        panelContent.innerHTML = `
            <div class="property-section">
                <div class="section-title">Shape Info</div>
                <div class="property-row">
                    <div class="property-label">
                        <span>Type</span>
                        <span class="property-value">Circle</span>
                    </div>
                </div>
                <div class="property-row">
                    <div class="property-label">
                        <span>Name</span>
                    </div>
                    <input type="text" value="${circle.name}" id="shapeName">
                </div>
            </div>

            <div class="property-section">
                <div class="section-title">Center</div>
                <div class="property-row">
                    <div class="property-label">
                        <span>x</span>
                        <span class="property-value" id="cx-display">${circle.center.x.toFixed(2)}</span>
                    </div>
                    <input id="cx" type="number" step="0.1" value="${circle.center.x}">
                </div>
                <div class="property-row">
                    <div class="property-label">
                        <span>y</span>
                        <span class="property-value" id="cy-display">${circle.center.y.toFixed(2)}</span>
                    </div>
                    <input id="cy" type="number" step="0.1" value="${circle.center.y}">
                </div>
                <div class="property-row">
                    <div class="property-label">
                        <span>z</span>
                        <span class="property-value" id="cz-display">${circle.center.z.toFixed(2)}</span>
                    </div>
                    <input id="cz" type="number" step="0.1" value="${circle.center.z}">
                </div>
            </div>

            <div class="property-section">
                <div class="section-title">Radius</div>
                <div class="property-row">
                    <div class="property-label">
                        <span>R</span>
                        <span class="property-value" id="radius-display">${circle.radius.toFixed(2)}</span>
                    </div>
                    <input id="radius" type="number" step="0.1" min="0.1" value="${circle.radius}">
                </div>
            </div>

            <div class="property-section">
                <div class="section-title">Color</div>
                <div class="property-row">
                    <input id="color" type="color" value="${circle.color}">
                </div>
                <div class="property-row">
                    <div class="property-label">
                        <span>Opacity</span>
                        <span class="property-value" id="opacity-display">${Math.round(circle.opacity * 100)}%</span>
                    </div>
                    <input id="opacity" type="range" min="0" max="1" step="0.05" value="${circle.opacity}">
                </div>
            </div>

            <div class="property-section">
                <div class="property-actions">
                    <button class="btn btn-primary" id="updateBtn">
                        <i class="fas fa-sync"></i>
                        Update
                    </button>
                </div>
                <div class="property-actions" style="margin-top: 8px;">
                    <button class="btn btn-secondary" id="hideBtn">
                        <i class="fas fa-eye-slash"></i>
                        Hide
                    </button>
                    <button class="btn btn-danger" id="deleteBtn">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        `

        const inputs = {
            cx: document.getElementById('cx') as HTMLInputElement,
            cy: document.getElementById('cy') as HTMLInputElement,
            cz: document.getElementById('cz') as HTMLInputElement,
            radius: document.getElementById('radius') as HTMLInputElement,
            opacity: document.getElementById('opacity') as HTMLInputElement
        }

        Object.entries(inputs).forEach(([key, input]) => {
            if (input) {
                input.addEventListener('input', () => {
                    const value = +input.value
                    const display = document.getElementById(`${key}-display`)
                    if (display) {
                        display.textContent = key === 'opacity'
                            ? `${Math.round(value * 100)}%`
                            : value.toFixed(2)
                    }
                })
            }
        })

        const hideBtn = document.getElementById('hideBtn') as HTMLButtonElement
        if (hideBtn) {
            hideBtn.innerHTML = circle.isHidden
                ? '<i class="fas fa-eye"></i> Show'
                : '<i class="fas fa-eye-slash"></i> Hide'

            hideBtn.onclick = () => {
                circle.toggleHidden()
                shapeStore.updateSelected(scene)
                updateUI()
            }
        }

        document.getElementById('updateBtn')!.onclick = () => {
            const newX = +inputs.cx.value
            const newY = +inputs.cy.value
            const newZ = +inputs.cz.value
            const newRadius = +inputs.radius.value
            const newColor = (document.getElementById('color') as HTMLInputElement).value
            const newOpacity = +inputs.opacity.value
            const newName = (document.getElementById('shapeName') as HTMLInputElement).value

            const geometryChanged =
                newX !== circle.center.x ||
                newY !== circle.center.y ||
                newZ !== circle.center.z ||
                newRadius !== circle.radius

            circle.center.x = newX
            circle.center.y = newY
            circle.center.z = newZ
            circle.radius = newRadius
            circle.color = newColor
            circle.opacity = newOpacity
            circle.name = newName

            if (geometryChanged) {
                shapeStore.rebuildSelected(scene)
            } else {
                shapeStore.updateSelected(scene)
            }
            updateUI()
        }

        document.getElementById('deleteBtn')!.onclick = () => {
            shapeStore.remove(circle.id)
            if (circle.object3D) {
                scene.remove(circle.object3D)
                disposeObject3D(circle.object3D)
            }
            updateUI()
        }
    }

    if (shapeType === 'LINE') {
        const line = shape as Line
        panelContent.innerHTML = `
            <div class="property-section">
                <div class="section-title">Shape Info</div>
                <div class="property-row">
                    <div class="property-label">
                        <span>Type</span>
                        <span class="property-value">Line</span>
                    </div>
                </div>
                <div class="property-row">
                    <div class="property-label">
                        <span>Name</span>
                    </div>
                    <input type="text" value="${line.name}" id="shapeName">
                </div>
            </div>

            <div class="property-section">
                <div class="section-title">Start Point</div>
                <div class="property-row">
                    <div class="property-label">
                        <span>x</span>
                        <span class="property-value">${line.startPoint.x.toFixed(2)}</span>
                    </div>
                    <input type="number" id="startPointX" step="0.1" value="${line.startPoint.x}">
                </div>
                <div class="property-row">
                    <div class="property-label">
                        <span>y</span>
                        <span class="property-value">${line.startPoint.y.toFixed(2)}</span>
                    </div>
                    <input type="number" id="startPointY" step="0.1" value="${line.startPoint.y}">
                </div>
            </div>

            <div class="property-section">
                <div class="section-title">End Point</div>
                <div class="property-row">
                    <div class="property-label">
                        <span>x</span>
                        <span class="property-value">${line.endPoint.x.toFixed(2)}</span>
                    </div>
                    <input type="number" id="endPointX" step="0.1" value="${line.endPoint.x}">
                </div>
                <div class="property-row">
                    <div class="property-label">
                        <span>y</span>
                        <span class="property-value">${line.endPoint.y.toFixed(2)}</span>
                    </div>
                    <input type="number" id="endPointY" step="0.1" value="${line.endPoint.y}">
                </div>
            </div>

            <div class="property-section">
                <div class="section-title">Color</div>
                <div class="property-row">
                    <input id="color" type="color" value="${line.color}">
                </div>
                <div class="property-row">
                    <div class="property-label">
                        <span>Opacity</span>
                        <span class="property-value" id="opacity-display">${Math.round(line.opacity * 100)}%</span>
                    </div>
                    <input id="opacity" type="range" min="0" max="1" step="0.05" value="${line.opacity}">
                </div>
            </div>

            <div class="property-section">
       
            <div class="property-actions">
                    <button class="btn btn-primary" id="updateBtn">
                        <i class="fas fa-sync"></i>
                        Update
                    </button>
                    </div>
         
                <div class="property-actions">
                    <button class="btn btn-secondary" id="hideBtn">
                        <i class="fas fa-eye-slash"></i>
                        Hide
                    </button>
                    <button class="btn btn-danger"  id="deleteBtn">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        `

        const inputs = {
            sx: document.getElementById('startPointX') as HTMLInputElement,
            sy: document.getElementById('startPointY') as HTMLInputElement,
            ex: document.getElementById('endPointX') as HTMLInputElement,
            ey: document.getElementById('endPointY') as HTMLInputElement,
            color: document.getElementById('color') as HTMLInputElement,
            opacity: document.getElementById('opacity') as HTMLInputElement
        }

        Object.entries(inputs).forEach(([key, input]) => {
            if (input) {
                input.addEventListener('input', () => {
                    const value = +input.value
                    const display = document.getElementById(`${key}-display`)
                    if (display) {
                        display.textContent = key === 'opacity'
                            ? `${Math.round(value * 100)}%`
                            : value.toFixed(2)
                    }
                })
            }
        })

        const hideBtn = document.getElementById('hideBtn') as HTMLButtonElement
        if (hideBtn) {
            hideBtn.innerHTML = line.isHidden
                ? '<i class="fas fa-eye"></i> Show'
                : '<i class="fas fa-eye-slash"></i> Hide'

            hideBtn.onclick = () => {
                line.toggleHidden()
                shapeStore.updateSelected(scene)
                updateUI()
            }
        }

        document.getElementById('updateBtn')!.onclick = () => {
            const newSX = +inputs.sx.value
            const newSY = +inputs.sy.value
            const newEX = +inputs.ex.value
            const newEY = +inputs.ey.value
            const newColor = (document.getElementById('color') as HTMLInputElement).value
            const newOpacity = +inputs.opacity.value
            const newName = (document.getElementById('shapeName') as HTMLInputElement).value

            const geometryChanged =
                newSX !== line.startPoint.x ||
                newSY !== line.startPoint.y ||
                newEX !== line.endPoint.x ||
                newEY !== line.endPoint.y

            line.startPoint.x = newSX
            line.startPoint.y = newSY
            line.endPoint.x = newEX
            line.endPoint.y = newEY
            line.color = newColor
            line.opacity = newOpacity
            line.name = newName

            if (geometryChanged) {
                shapeStore.rebuildSelected(scene)
            } else {
                shapeStore.updateSelected(scene)
            }
            updateUI()
        }

        document.getElementById('deleteBtn')!.onclick = () => {
            shapeStore.remove(line.id)
            if (line.object3D) {
                scene.remove(line.object3D)
                disposeObject3D(line.object3D)
            }
            updateUI()
        }
    }

    if (shapeType === 'ELLIPSE') {
        const ellipse = shape as Ellipse
        panelContent.innerHTML = `
            <div class="property-section">
                <div class="section-title">Shape Info</div>
                <div class="property-row">
                    <div class="property-label">
                        <span>Type</span>
                        <span class="property-value">Ellipse</span>
                    </div>
                </div>
                <div class="property-row">
                    <div class="property-label">
                        <span>Name</span>
                    </div>
                    <input type="text" value="${ellipse.name}" id="shapeName">
                </div>
            </div>

            <div class="property-section">
                <div class="section-title">Center</div>
                <div class="property-row">
                    <div class="property-label"><span>x</span></div>
                    <input id="cx" type="number" step="0.1" value="${ellipse.center.x}">
                    <div class="property-label"><span>y</span></div>
                    <input id="cy" type="number" step="0.1" value="${ellipse.center.y}">
                </div>
            </div>

            <div class="property-section">
                <div class="section-title">Radii</div>
                <div class="property-row">
                    <div class="property-label"><span>Radius X</span></div>
                    <input id="rx" type="number" step="0.1" value="${ellipse.radiusX}">
                </div>
                <div class="property-row">
                    <div class="property-label"><span>Radius Y</span></div>
                    <input id="ry" type="number" step="0.1" value="${ellipse.radiusY}">
                </div>
            </div>

            <div class="property-section">
                <div class="section-title">Visuals</div>
                <div class="property-row">
                    <div class="property-label"><span>Color</span></div>
                    <input id="color" type="color" value="${ellipse.color}">
                </div>
                <div class="property-row">
                    <div class="property-label"><span>Opacity</span></div>
                    <input id="opacity" type="range" min="0" max="1" step="0.05" value="${ellipse.opacity}">
                </div>
            </div>

            <div class="property-section">
                <div class="property-actions">
                    <button class="btn btn-primary" id="updateBtn">
                        <i class="fas fa-sync"></i> Update
                    </button>
                </div>
                <div class="property-actions" style="margin-top: 8px;">
                    <button class="btn btn-secondary" id="hideBtn">Hide</button>
                    <button class="btn btn-danger" id="deleteBtn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `

        const hideBtn = document.getElementById('hideBtn') as HTMLButtonElement
        if (hideBtn) {
            hideBtn.innerHTML = ellipse.isHidden
                ? '<i class="fas fa-eye"></i> Show'
                : '<i class="fas fa-eye-slash"></i> Hide'

            hideBtn.onclick = () => {
                ellipse.toggleHidden()
                shapeStore.updateSelected(scene)
                updateUI()
            }
        }

        document.getElementById('updateBtn')!.onclick = () => {
            const newX = +(document.getElementById('cx') as HTMLInputElement).value
            const newY = +(document.getElementById('cy') as HTMLInputElement).value
            const newRX = +(document.getElementById('rx') as HTMLInputElement).value
            const newRY = +(document.getElementById('ry') as HTMLInputElement).value
            const newColor = (document.getElementById('color') as HTMLInputElement).value
            const newOpacity = +(document.getElementById('opacity') as HTMLInputElement).value
            const newName = (document.getElementById('shapeName') as HTMLInputElement).value

            const geometryChanged =
                newX !== ellipse.center.x ||
                newY !== ellipse.center.y ||
                newRX !== ellipse.radiusX ||
                newRY !== ellipse.radiusY

            ellipse.center.x = newX
            ellipse.center.y = newY
            ellipse.radiusX = newRX
            ellipse.radiusY = newRY
            ellipse.color = newColor
            ellipse.opacity = newOpacity
            ellipse.name = newName

            if (geometryChanged) {
                shapeStore.rebuildSelected(scene)
            } else {
                shapeStore.updateSelected(scene)
            }
            updateUI()
        }

        document.getElementById('deleteBtn')!.onclick = () => {
            shapeStore.remove(ellipse.id)
            if (ellipse.object3D) {
                scene.remove(ellipse.object3D)
                disposeObject3D(ellipse.object3D)
            }
            updateUI()
        }
    }

    if (shapeType === 'POLYLINE') {
    const polyline = shape as any 

    panelContent.innerHTML = `
        <div class="property-section">
            <div class="section-title">Shape Info</div>
            <div class="property-row">
                <div class="property-label">
                    <span>Type</span>
                    <span class="property-value">Polyline</span>
                </div>
            </div>
            <div class="property-row">
                <div class="property-label">
                    <span>Name</span>
                </div>
                <input type="text" value="${polyline.name}" id="shapeName">
            </div>
            <div class="property-row">
                <div class="property-label">
                    <span>Total Points</span>
                </div>
                <span class="property-value">${polyline.points.length}</span>
            </div>
        </div>

        <div class="property-section">
            <div class="section-title">Points</div>
            ${polyline.points.map((p: any, i: number) => `
                <div class="property-row">
                    <div class="property-label">P${i}</div>
                    <input type="number" step="0.1" id="px-${i}" value="${p.x}">
                    <input type="number" step="0.1" id="py-${i}" value="${p.y}">
                </div>
            `).join('')}
        </div>

        <div class="property-section">
            <div class="section-title">Visuals</div>
            <div class="property-row">
                <input id="color" type="color" value="${polyline.color}">
            </div>
            <div class="property-row">
                <div class="property-label">
                    <span>Opacity</span>
                </div>
                <input id="opacity" type="range" min="0" max="1" step="0.05" value="${polyline.opacity}">
            </div>
        </div>

        <div class="property-section">
            <div class="property-actions">
                <button class="btn btn-primary" id="updateBtn">
                    <i class="fas fa-sync"></i>
                    Update
                </button>
            </div>
            <div class="property-actions" style="margin-top: 8px;">
                <button class="btn btn-secondary" id="hideBtn"></button>
                <button class="btn btn-danger" id="deleteBtn">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
    `

    const hideBtn = document.getElementById('hideBtn') as HTMLButtonElement
    hideBtn.innerHTML = polyline.isHidden
        ? '<i class="fas fa-eye"></i> Show'
        : '<i class="fas fa-eye-slash"></i> Hide'

    hideBtn.onclick = () => {
        polyline.toggleHidden()
        shapeStore.updateSelected(scene)
        updateUI()
    }

    document.getElementById('updateBtn')!.onclick = () => {
        polyline.name = (document.getElementById('shapeName') as HTMLInputElement).value
        polyline.color = (document.getElementById('color') as HTMLInputElement).value
        polyline.opacity = +(document.getElementById('opacity') as HTMLInputElement).value

        // update points
        polyline.points.forEach((p: any, i: number) => {
            p.x = +(document.getElementById(`px-${i}`) as HTMLInputElement).value
            p.y = +(document.getElementById(`py-${i}`) as HTMLInputElement).value
        })

        shapeStore.rebuildSelected(scene)
        updateUI()
    }

    document.getElementById('deleteBtn')!.onclick = () => {
        shapeStore.remove(polyline.id)
        if (polyline.object3D) {
            scene.remove(polyline.object3D)
            disposeObject3D(polyline.object3D)
        }
        updateUI()
    }
}
}