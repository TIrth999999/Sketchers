import * as THREE from 'three'
import { Shape } from './Shape'

export type Point = {
  x: number,
  y: number,
  z: number
}

export type ShapeData = {
  shape: Shape
  mesh: THREE.Object3D
}

export type ToolType = 'LINE' | 'CIRCLE' | 'ELLIPSE' | 'POLYLINE' | 'SELECT'

export type PreviewShape = THREE.Line | THREE.Mesh

// For UI Purpose
export type GridOptions = {
  svg: SVGElement
  container: HTMLElement
  sizeInput?: HTMLInputElement
  sizeValue?: HTMLElement
  opacityInput?: HTMLInputElement
  opacityValue?: HTMLElement
  toggleButton?: HTMLButtonElement
}

// For UI Purpose
export type NavbarOptions = {
  leftPanel: HTMLElement
  rightPanel: HTMLElement
  leftPanelToggle: HTMLButtonElement
  rightPanelToggle: HTMLButtonElement
  leftPanelClose: HTMLButtonElement
  rightPanelClose: HTMLButtonElement
  toolButtons: NodeListOf<HTMLButtonElement>
  onToolSelect: (tool: string) => void
}