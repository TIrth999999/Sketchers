import * as THREE from 'three'

export function createCamera(width: number, height: number) {
  const aspect = width / height
  const viewSize = 10

  const camera = new THREE.OrthographicCamera(
    -viewSize * aspect,
     viewSize * aspect,
     viewSize,
    -viewSize,
     0.1,
     100
  )

  camera.position.set(0, 0, 10)
  camera.lookAt(0, 0, 0)
  return camera
}