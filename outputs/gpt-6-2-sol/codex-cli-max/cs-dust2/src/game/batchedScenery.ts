import * as THREE from 'three'

interface Instance {
  geometry: THREE.BufferGeometry
  matrix: THREE.Matrix4
  color: THREE.Color
}

interface Batch {
  map: THREE.Texture | null
  instances: Instance[]
}

const SUN = new THREE.Vector3(-0.408, 0.816, 0.408)
const CHUNK_SIZE = 23

function bake(batch: Batch) {
  const size = batch.instances.reduce((count, { geometry }) => count + (geometry.index?.count ?? geometry.getAttribute('position').count), 0)
  const vertices = new Float32Array(size * 3)
  const colors = new Float32Array(size * 3)
  const uvs = new Float32Array(size * 2)
  const point = new THREE.Vector3()
  const face = new THREE.Vector3()
  const normals = new THREE.Matrix3()
  let cursor = 0
  for (const { geometry, matrix, color } of batch.instances) {
    const xyz = geometry.getAttribute('position')
    const normal = geometry.getAttribute('normal')
    const uv = geometry.getAttribute('uv')
    const index = geometry.index
    normals.getNormalMatrix(matrix)
    for (let i = 0; i < (index?.count ?? xyz.count); i++) {
      const vertex = index ? index.getX(i) : i
      point.set(xyz.getX(vertex), xyz.getY(vertex), xyz.getZ(vertex)).applyMatrix4(matrix)
      face.set(normal.getX(vertex), normal.getY(vertex), normal.getZ(vertex)).applyMatrix3(normals).normalize()
      const light = 0.67 + Math.max(0, face.dot(SUN)) * 0.96
      point.toArray(vertices, cursor * 3)
      colors[cursor * 3] = color.r * light
      colors[cursor * 3 + 1] = color.g * light
      colors[cursor * 3 + 2] = color.b * light
      uvs[cursor * 2] = uv.getX(vertex)
      uvs[cursor * 2 + 1] = uv.getY(vertex)
      cursor += 1
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geometry.computeBoundingSphere()
  return geometry
}

/**
 * Keep matte, stationary geometry in spatial batches on slower renderers.
 * Its vertices carry directional shading, so this pass uses one simple shader.
 */
export class BatchedScenery {
  private original: THREE.Mesh[] = []
  private combined: THREE.Group | null = null

  constructor(private scene: THREE.Scene) {
    this.original = scene.children.filter((object): object is THREE.Mesh =>
      object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial,
    )
  }

  toggle(enabled: boolean) {
    if (enabled && !this.combined) this.build()
    if (this.combined) this.combined.visible = enabled
    for (const object of this.original) object.visible = !enabled
  }

  private build() {
    this.combined = new THREE.Group()
    const cells = new Map<string, Batch>()
    this.scene.updateMatrixWorld(true)
    for (const object of this.original) {
      const { material, geometry } = object as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
      const save = (matrix: THREE.Matrix4, prefix = '') => {
        const location = new THREE.Vector3().setFromMatrixPosition(matrix)
        const key = prefix + Math.floor(location.x / CHUNK_SIZE) + ',' + Math.floor(location.z / CHUNK_SIZE) + ':' + (material.map?.id ?? 0)
        if (!cells.has(key)) cells.set(key, { map: material.map, instances: [] })
        cells.get(key)!.instances.push({ geometry, matrix, color: material.color })
      }
      if (object instanceof THREE.InstancedMesh) {
        for (let i = 0; i < object.count; i++) {
          const matrix = new THREE.Matrix4()
          object.getMatrixAt(i, matrix)
          save(matrix.premultiply(object.matrixWorld))
        }
      } else {
        save(object.matrixWorld, geometry.boundingSphere && geometry.boundingSphere.radius > 70 ? 'ground' : '')
      }
    }
    const materials = new Map<THREE.Texture | null, THREE.MeshBasicMaterial>()
    for (const batch of cells.values()) {
      if (!materials.has(batch.map)) {
        materials.set(batch.map, new THREE.MeshBasicMaterial({ map: batch.map, vertexColors: true }))
      }
      this.combined.add(new THREE.Mesh(bake(batch), materials.get(batch.map)!))
    }
    this.scene.add(this.combined)
  }
}
