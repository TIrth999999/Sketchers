import * as THREE from 'three'
import { Shape } from '../core/Shape'
import type { Point } from '../core/types'

export class Circle extends Shape {
  center: Point
  radius: number

  constructor(center: Point, radius: number) {
    super('Circle')
    this.center = center
    this.radius = radius
  }

  getType(): string {
    return 'CIRCLE'
  }

  getData(): any {
    return {
      center: this.center,
      radius: this.radius
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
    const geometry = new THREE.CircleGeometry(this.radius, 64)
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