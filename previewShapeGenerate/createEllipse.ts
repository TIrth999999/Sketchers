import * as THREE from 'three'
import type { Point } from '../core/types'

export function createEllipse(center: Point, rx: number, ry: number): THREE.LineLoop {
    const curve = new THREE.EllipseCurve(
        0, 0,
        rx, ry,
        0, Math.PI * 2
    )

    const points = curve.getPoints(64)
    const geometry = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, p.y, 0))
    )

    const material = new THREE.LineBasicMaterial({ color: 0x5599ff })
    const ellipse = new THREE.LineLoop(geometry, material)

    ellipse.position.set(center.x, center.y, 0)

    return ellipse
}