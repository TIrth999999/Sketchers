import * as THREE from 'three'

export function disposeObject3D(obj: THREE.Object3D) {
    obj.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.Points) {
            if (child.geometry) {
                child.geometry.dispose()
            }

            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach((m) => m.dispose())
                } else {
                    child.material.dispose()
                }
            }
        }
    })
}
