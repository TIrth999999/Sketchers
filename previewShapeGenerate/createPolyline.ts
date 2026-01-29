import * as THREE from 'three'
import type { Point } from '../core/types'

export function createPolyline(points: Point[]): THREE.Line {

    const vectors = points.map(
        p => new THREE.Vector3(p.x, p.y, 0)
    )

    const geometry = new THREE.BufferGeometry().setFromPoints(vectors)

    const material = new THREE.LineBasicMaterial({
        color: 'blue'
    })

    return new THREE.Line(geometry, material)
}