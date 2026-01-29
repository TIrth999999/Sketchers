import * as THREE from 'three'
import { Shape } from '../core/Shape'
import type { Point } from '../core/types'

export class Polyline extends Shape {
  points: Point[]

  constructor(points: Point[] = []) {
    super('Polyline')
    this.points = points
  }

  getType() {
    return 'POLYLINE'
  }

  getData(): any {
    return {
      points: this.points
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

    const vectors = this.points.map(
      p => new THREE.Vector3(p.x, p.y, 0)
    )

    const geometry = new THREE.BufferGeometry().setFromPoints(vectors)

    const material = new THREE.LineBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: this.opacity
    })

    const polyline = new THREE.Line(geometry, material)
    polyline.visible = !this.isHidden

    return polyline
  }

}