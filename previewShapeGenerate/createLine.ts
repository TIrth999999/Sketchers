import * as THREE from 'three'
import type { Point } from '../core/types'

export function createLine(a: Point, b: Point): THREE.Line {
    const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(a.x, a.y, 0),
        new THREE.Vector3(b.x, b.y, 0)
    ])

    const material = new THREE.LineBasicMaterial({ color: 0xff5555 })
    return new THREE.Line(geometry, material)
}