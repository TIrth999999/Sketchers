import * as THREE from 'three'
import { Shape } from './Shape'
import { disposeObject3D } from '../utils/dispose'

export class ShapeStore {
    shapes: Map<string, Shape> = new Map()
    selectedShapeId: string | null = null

    add(shape: Shape) {
        this.shapes.set(shape.id, shape)
    }

    remove(id: string) {
        this.shapes.delete(id)
        if (this.selectedShapeId === id) {
            this.selectedShapeId = null
        }
    }

    select(id: string | null) {
        this.selectedShapeId = id
    }

    get selectedShape() {
        if (!this.selectedShapeId) return null
        return this.shapes.get(this.selectedShapeId) ?? null
    }

    getAllShapes(): Shape[] {
        return Array.from(this.shapes.values())
    }

    updateSelected(scene: THREE.Scene): void {
        const shape = this.selectedShape
        if (!shape || !shape.object3D) return

        shape.update()

        if (shape.isHidden) {
            scene.remove(shape.object3D)
        } else {
            scene.add(shape.object3D)
        }
    }

    rebuildSelected(scene: THREE.Scene): void {
        const shape = this.selectedShape
        if (!shape || !shape.object3D) return

        const oldObj = shape.object3D
        scene.remove(oldObj)

        disposeObject3D(oldObj)

        const newObj = shape.rebuild()
        shape.object3D = newObj

        if (!shape.isHidden) {
            scene.add(newObj)
        }
    }

    toJSON() {
        return {
            shapes: Array.from(this.shapes.values()),
            selectedShapeId: this.selectedShapeId
        }
    }

}

export const shapeStore = new ShapeStore()