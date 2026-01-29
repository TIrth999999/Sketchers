import * as THREE from 'three'
import type { Point } from '../core/types'

export function getMouseWorldPoint(
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  camera: THREE.Camera
): Point {
  const rect = canvas.getBoundingClientRect()

  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  const vector = new THREE.Vector3(x, y, 0)
  vector.unproject(camera)

  return { x: vector.x, y: vector.y, z: 0 }
}