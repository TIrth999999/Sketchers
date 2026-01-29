import * as THREE from 'three'
import { Shape } from '../core/Shape'
import type { Point } from '../core/types'

export class Ellipse extends Shape {
  center: Point
  radiusX: number
  radiusY: number

  constructor(center: Point, radiusX: number, radiusY: number) {
    super('Ellipse')
    this.center = center
    this.radiusX = radiusX
    this.radiusY = radiusY
  }

  getType(): string {
    return 'ELLIPSE'
  }

  getData(): any {
    return {
      center: this.center,
      radiusX: this.radiusX,
      radiusY: this.radiusY
    }
  }

  update(): void {
    if (!this.object3D) return

    const mesh = this.object3D as THREE.Mesh
    const material = mesh.material as THREE.MeshBasicMaterial

    material.color.set(this.color)
    material.opacity = this.opacity
    mesh.visible = !this.isHidden
  }

  rebuild(): THREE.Object3D {
    const shape = new THREE.Shape()
    shape.absellipse(
      0, 0,
      this.radiusX, this.radiusY,
      0, Math.PI * 2,
      false, 0
    )

    const geometry = new THREE.ShapeGeometry(shape)

    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: this.opacity
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(this.center.x, this.center.y, 0)
    mesh.visible = !this.isHidden

    return mesh
  }
}