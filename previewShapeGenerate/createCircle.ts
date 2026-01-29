import * as THREE from 'three'
import type { Point } from '../core/types'

export function createCircle(center: Point, edge: Point): THREE.Mesh {
    const dx = edge.x - center.x
    const dy = edge.y - center.y
    const radius = Math.sqrt(dx * dx + dy * dy)

    const geometry = new THREE.CircleGeometry(radius, 64)
    const material = new THREE.MeshBasicMaterial({
        color: 'red',
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(center.x, center.y, 0)

    return mesh
}
