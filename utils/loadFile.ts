// utils/loadFile.ts
import { Line } from '../shapes/Line'
import { Circle } from '../shapes/Circle'
import { Ellipse } from '../shapes/Ellipse'
import { Polyline } from '../shapes/Polyline'

import type { ShapeStore } from '../core/ShapeStore'
import * as THREE from 'three'

export function loadFile(
    file: File,
    shapeStore: ShapeStore,
    scene: THREE.Scene,
    onComplete?: () => void
) {
    const reader = new FileReader()

    reader.onload = () => {
        const json = JSON.parse(reader.result as string)

        shapeStore.getAllShapes().forEach(shape => {
            if (shape.object3D) scene.remove(shape.object3D)
        })
        shapeStore.shapes.clear()

        json.forEach((item: any) => {
            let shape

            switch (item.type) {
                case 'LINE':
                    shape = new Line(
                        item.data.startPoint,
                        item.data.endPoint
                    )
                    break

                case 'CIRCLE':
                    shape = new Circle(
                        item.data.center,
                        item.data.radius
                    )
                    break

                case 'ELLIPSE':
                    shape = new Ellipse(
                        item.data.center,
                        item.data.rx,
                        item.data.ry
                    )
                    break

                case 'POLYLINE':
                    shape = new Polyline(item.data.points)
                    break

                default:
                    console.warn('Unknown shape type:', item.type)
                    return
            }

            shape.id = item.id
            shape.name = item.name
            shape.color = item.color
            shape.opacity = item.opacity
            shape.isHidden = item.isHidden

            const mesh = shape.rebuild()
            shape.object3D = mesh

            if (!shape.isHidden) {
                scene.add(mesh)
            }

            shapeStore.add(shape)
        })
        onComplete?.()
    }

    reader.readAsText(file)
}
