import * as THREE from 'three'
import { Shape } from '../core/Shape'
import type { Point } from '../core/types'

export class Line extends Shape {
  startPoint: Point
  endPoint: Point

  constructor(startPoint: Point, endPoint: Point) {
    super('Line')
    this.startPoint = startPoint
    this.endPoint = endPoint
  }

  getType(): string {
    return 'LINE'
  }

  getData(): any {
    return {
      startPoint: this.startPoint,
      endPoint: this.endPoint
    }
  }

  update(): void {
    if (!this.object3D) return

    const line = this.object3D as THREE.Line
    const material = line.material as THREE.LineBasicMaterial

    material.color.set(this.color)
    material.opacity = this.opacity
    line.visible = !this.isHidden
  }

  rebuild(): THREE.Object3D {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(this.startPoint.x, this.startPoint.y, 0),
      new THREE.Vector3(this.endPoint.x, this.endPoint.y, 0)
    ])

    const material = new THREE.LineBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: this.opacity
    })

    const line = new THREE.Line(geometry, material)
    line.visible = !this.isHidden

    return line
  }
}