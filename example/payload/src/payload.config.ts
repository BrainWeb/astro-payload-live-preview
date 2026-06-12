import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const ASTRO_URL = process.env.ASTRO_URL || 'http://localhost:4321'
const PREVIEW_SECRET = process.env.PREVIEW_SECRET || 'PREVIEW_SECRET'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      collections: ['posts'],
      url: ({ data }) => `${ASTRO_URL}/posts/${data.id}?preview=${PREVIEW_SECRET}`,
    },
  },
  collections: [
    Users,
    Media,
    {
      slug: 'posts',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          required: true,
        },
      ],
      versions: {
        drafts: {
          autosave: {
            interval: 100,
          },
        },
      },
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  async onInit(payload) {
    const { totalDocs: postsCount } = await payload.count({ collection: 'posts' })

    if (!postsCount) {
      await payload.create({ collection: 'posts', data: { _status: 'published', title: 'Post 1' } })
    }
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
