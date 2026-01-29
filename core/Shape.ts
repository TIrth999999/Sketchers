import * as THREE from 'three'

export abstract class Shape {
    id: string
    name: string
    color: string
    opacity: number
    isHidden: boolean
    object3D: THREE.Object3D | null = null

    constructor(name: string) {
        this.id = crypto.randomUUID()
        this.name = name
        this.color = 'red'
        this.opacity = 1
        this.isHidden = false
    }

    toggleHidden() {
        this.isHidden = !this.isHidden
    }

    abstract getType(): string

    abstract getData(): any

    abstract update(): void

    abstract rebuild(): THREE.Object3D
}