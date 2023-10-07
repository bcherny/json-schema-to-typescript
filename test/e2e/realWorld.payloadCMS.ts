/**
 * @see https://github.com/bcherny/json-schema-to-typescript/issues/422
 */
export const input = {
  definitions: {
    mainMenu: {
      title: 'Main Menu',
      type: 'object',
      additionalProperties: false,
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              type: {
                type: 'string',
                enum: ['link', 'subMenu'],
              },
              label: {
                type: 'string',
              },
              subMenu: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  column1: {
                    type: 'array',
                    items: {
                      oneOf: [
                        {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            appearance: {
                              type: 'string',
                              enum: ['primary', 'secondary', 'arrow'],
                            },
                            link: {
                              type: 'object',
                              additionalProperties: false,
                              properties: {
                                type: {
                                  type: 'string',
                                  enum: ['reference', 'custom'],
                                },
                                label: {
                                  type: 'string',
                                },
                                reference: {
                                  oneOf: [
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/pages',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'pages',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/posts',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'posts',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/housing',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'housing',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                  ],
                                },
                                url: {
                                  type: 'string',
                                },
                              },
                              required: ['label', 'reference', 'url'],
                            },
                            id: {
                              type: 'string',
                            },
                            blockName: {
                              type: 'string',
                            },
                            blockType: {
                              const: 'menuLink',
                            },
                          },
                          required: ['blockType'],
                        },
                        {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            content: {
                              type: 'string',
                            },
                            id: {
                              type: 'string',
                            },
                            blockName: {
                              type: 'string',
                            },
                            blockType: {
                              const: 'menuDescription',
                            },
                          },
                          required: ['blockType', 'content'],
                        },
                        {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            media: {
                              oneOf: [
                                {
                                  type: 'string',
                                },
                                {
                                  $ref: '#/definitions/media',
                                },
                              ],
                            },
                            headline: {
                              type: 'string',
                            },
                            link: {
                              type: 'object',
                              additionalProperties: false,
                              properties: {
                                type: {
                                  type: 'string',
                                  enum: ['reference', 'custom'],
                                },
                                reference: {
                                  oneOf: [
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/pages',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'pages',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/posts',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'posts',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/housing',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'housing',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                  ],
                                },
                                url: {
                                  type: 'string',
                                },
                              },
                              required: ['reference', 'url'],
                            },
                            id: {
                              type: 'string',
                            },
                            blockName: {
                              type: 'string',
                            },
                            blockType: {
                              const: 'menuFeature',
                            },
                          },
                          required: ['blockType', 'media', 'headline'],
                        },
                      ],
                    },
                  },
                  enableColumn2: {
                    type: 'boolean',
                  },
                  column2: {
                    type: 'array',
                    items: {
                      oneOf: [
                        {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            appearance: {
                              type: 'string',
                              enum: ['primary', 'secondary', 'arrow'],
                            },
                            link: {
                              type: 'object',
                              additionalProperties: false,
                              properties: {
                                type: {
                                  type: 'string',
                                  enum: ['reference', 'custom'],
                                },
                                label: {
                                  type: 'string',
                                },
                                reference: {
                                  oneOf: [
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/pages',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'pages',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/posts',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'posts',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/housing',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'housing',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                  ],
                                },
                                url: {
                                  type: 'string',
                                },
                              },
                              required: ['label', 'reference', 'url'],
                            },
                            id: {
                              type: 'string',
                            },
                            blockName: {
                              type: 'string',
                            },
                            blockType: {
                              const: 'menuLink',
                            },
                          },
                          required: ['blockType'],
                        },
                        {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            content: {
                              type: 'string',
                            },
                            id: {
                              type: 'string',
                            },
                            blockName: {
                              type: 'string',
                            },
                            blockType: {
                              const: 'menuDescription',
                            },
                          },
                          required: ['blockType', 'content'],
                        },
                        {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            media: {
                              oneOf: [
                                {
                                  type: 'string',
                                },
                                {
                                  $ref: '#/definitions/media',
                                },
                              ],
                            },
                            headline: {
                              type: 'string',
                            },
                            link: {
                              type: 'object',
                              additionalProperties: false,
                              properties: {
                                type: {
                                  type: 'string',
                                  enum: ['reference', 'custom'],
                                },
                                reference: {
                                  oneOf: [
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/pages',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'pages',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/posts',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'posts',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/housing',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'housing',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                  ],
                                },
                                url: {
                                  type: 'string',
                                },
                              },
                              required: ['reference', 'url'],
                            },
                            id: {
                              type: 'string',
                            },
                            blockName: {
                              type: 'string',
                            },
                            blockType: {
                              const: 'menuFeature',
                            },
                          },
                          required: ['blockType', 'media', 'headline'],
                        },
                      ],
                    },
                  },
                },
                required: [],
              },
              link: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  type: {
                    type: 'string',
                    enum: ['reference', 'custom'],
                  },
                  reference: {
                    oneOf: [
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/pages',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'pages',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/posts',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'posts',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/housing',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'housing',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                    ],
                  },
                  url: {
                    type: 'string',
                  },
                },
                required: ['reference', 'url'],
              },
              id: {
                type: 'string',
              },
            },
            required: ['label'],
          },
        },
        secondaryItems: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              link: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  type: {
                    type: 'string',
                    enum: ['reference', 'custom'],
                  },
                  label: {
                    type: 'string',
                  },
                  reference: {
                    oneOf: [
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/pages',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'pages',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/posts',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'posts',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/housing',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'housing',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                    ],
                  },
                  url: {
                    type: 'string',
                  },
                },
                required: ['label', 'reference', 'url'],
              },
              id: {
                type: 'string',
              },
            },
            required: [],
          },
        },
      },
      required: [],
    },
    footer: {
      title: 'Footer',
      type: 'object',
      additionalProperties: false,
      properties: {
        column1: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              appearance: {
                type: 'string',
                enum: ['primary', 'secondary', 'tertiary'],
              },
              label: {
                type: 'string',
              },
              useLink: {
                type: 'boolean',
              },
              link: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  type: {
                    type: 'string',
                    enum: ['reference', 'custom'],
                  },
                  reference: {
                    oneOf: [
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/pages',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'pages',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/posts',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'posts',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/housing',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'housing',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                    ],
                  },
                  url: {
                    type: 'string',
                  },
                },
                required: ['reference', 'url'],
              },
              id: {
                type: 'string',
              },
            },
            required: [],
          },
        },
        column2: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              appearance: {
                type: 'string',
                enum: ['secondary', 'tertiary'],
              },
              label: {
                type: 'string',
              },
              useLink: {
                type: 'boolean',
              },
              link: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  type: {
                    type: 'string',
                    enum: ['reference', 'custom'],
                  },
                  reference: {
                    oneOf: [
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/pages',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'pages',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/posts',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'posts',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/housing',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'housing',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                    ],
                  },
                  url: {
                    type: 'string',
                  },
                },
                required: ['reference', 'url'],
              },
              id: {
                type: 'string',
              },
            },
            required: [],
          },
        },
      },
      required: [],
    },
    meta: {
      title: 'Meta',
      type: 'object',
      additionalProperties: false,
      properties: {
        socialMediaLinks: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              type: {
                type: 'string',
                enum: ['facebook', 'vimeo', 'twitter', 'linkedin', 'instagram'],
              },
              url: {
                type: 'string',
              },
              id: {
                type: 'string',
              },
            },
            required: ['type', 'url'],
          },
        },
        legalLinks: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              link: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  type: {
                    type: 'string',
                    enum: ['reference', 'custom'],
                  },
                  label: {
                    type: 'string',
                  },
                  reference: {
                    oneOf: [
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/pages',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'pages',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/posts',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'posts',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/housing',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'housing',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                    ],
                  },
                  url: {
                    type: 'string',
                  },
                },
                required: ['label', 'reference', 'url'],
              },
              id: {
                type: 'string',
              },
            },
            required: [],
          },
        },
        locations: {
          type: 'array',
          items: {
            oneOf: [
              {
                type: 'string',
              },
              {
                $ref: '#/definitions/locations',
              },
            ],
          },
        },
        phone: {
          type: 'string',
        },
        nationalPhone: {
          type: 'string',
        },
        fax: {
          type: 'string',
        },
        popularSearchTerms: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              term: {
                type: 'string',
              },
              id: {
                type: 'string',
              },
            },
            required: ['term'],
          },
        },
      },
      required: [],
    },
    pages: {
      title: 'Page',
      type: 'object',
      additionalProperties: false,
      properties: {
        breadcrumbs: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              doc: {
                oneOf: [
                  {
                    type: 'string',
                  },
                  {
                    $ref: '#/definitions/pages',
                  },
                ],
              },
              url: {
                type: 'string',
              },
              label: {
                type: 'string',
              },
              id: {
                type: 'string',
              },
            },
            required: [],
          },
        },
        title: {
          type: 'string',
        },
        showBreadcrumbs: {
          type: 'boolean',
        },
        hero: {
          type: 'object',
          additionalProperties: false,
          properties: {
            type: {
              type: 'string',
              enum: [
                'basic',
                'content',
                'contentMedia',
                'contentMedia2',
                'contentSidebar',
                'columnsBelow',
                'quickNav',
                'fullscreenBackground',
                'fullscreenSlider',
              ],
            },
            basic: {
              type: 'object',
              additionalProperties: false,
              properties: {
                richText: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
              },
              required: [],
            },
            content: {
              type: 'object',
              additionalProperties: false,
              properties: {
                richText: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
              },
              required: [],
            },
            contentMedia: {
              type: 'object',
              additionalProperties: false,
              properties: {
                richText: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
                media: {
                  oneOf: [
                    {
                      type: 'string',
                    },
                    {
                      $ref: '#/definitions/media',
                    },
                  ],
                },
              },
              required: ['media'],
            },
            contentMedia2: {
              type: 'object',
              additionalProperties: false,
              properties: {
                richText: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
                media: {
                  oneOf: [
                    {
                      type: 'string',
                    },
                    {
                      $ref: '#/definitions/media',
                    },
                  ],
                },
              },
              required: ['media'],
            },
            contentSidebar: {
              type: 'object',
              additionalProperties: false,
              properties: {
                mainContent: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
                sidebarContent: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
              },
              required: [],
            },
            columnsBelow: {
              type: 'object',
              additionalProperties: false,
              properties: {
                backgroundMedia: {
                  oneOf: [
                    {
                      type: 'string',
                    },
                    {
                      $ref: '#/definitions/media',
                    },
                  ],
                },
                useOverlay: {
                  type: 'boolean',
                },
                richText: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
                columns: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      heading: {
                        type: 'string',
                      },
                      description: {
                        type: 'string',
                      },
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: ['heading', 'description'],
                  },
                },
              },
              required: ['backgroundMedia'],
            },
            fullscreenBackground: {
              type: 'object',
              additionalProperties: false,
              properties: {
                invertColors: {
                  type: 'boolean',
                },
                backgroundMedia: {
                  oneOf: [
                    {
                      type: 'string',
                    },
                    {
                      $ref: '#/definitions/media',
                    },
                  ],
                },
                useOverlay: {
                  type: 'boolean',
                },
                richText: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
              },
              required: ['backgroundMedia'],
            },
            quickNav: {
              type: 'object',
              additionalProperties: false,
              properties: {
                invertColors: {
                  type: 'boolean',
                },
                backgroundMedia: {
                  oneOf: [
                    {
                      type: 'string',
                    },
                    {
                      $ref: '#/definitions/media',
                    },
                  ],
                },
                useOverlay: {
                  type: 'boolean',
                },
                richText: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
                columns: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      heading: {
                        type: 'string',
                      },
                      description: {
                        type: 'string',
                      },
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: ['heading', 'description'],
                  },
                },
              },
              required: ['backgroundMedia'],
            },
            fullscreenSlider: {
              type: 'object',
              additionalProperties: false,
              properties: {
                useStaticContent: {
                  type: 'boolean',
                },
                richText: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
                slides: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      backgroundMedia: {
                        oneOf: [
                          {
                            type: 'string',
                          },
                          {
                            $ref: '#/definitions/media',
                          },
                        ],
                      },
                      useOverlay: {
                        type: 'boolean',
                      },
                      richText: {
                        type: 'array',
                        items: {
                          type: 'object',
                        },
                      },
                      links: {
                        type: 'array',
                        items: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            link: {
                              type: 'object',
                              additionalProperties: false,
                              properties: {
                                appearance: {
                                  type: 'string',
                                  enum: ['text', 'primaryButton', 'secondaryButton'],
                                },
                                type: {
                                  type: 'string',
                                  enum: ['reference', 'custom'],
                                },
                                label: {
                                  type: 'string',
                                },
                                reference: {
                                  oneOf: [
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/pages',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'pages',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/posts',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'posts',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/housing',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'housing',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                  ],
                                },
                                url: {
                                  type: 'string',
                                },
                              },
                              required: ['label', 'reference', 'url'],
                            },
                            id: {
                              type: 'string',
                            },
                          },
                          required: [],
                        },
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: ['backgroundMedia'],
                  },
                },
              },
              required: [],
            },
          },
          required: ['type'],
        },
        layout: {
          type: 'array',
          items: {
            oneOf: [
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  appearance: {
                    type: 'string',
                    enum: ['default', 'condensed'],
                  },
                  sections: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        label: {
                          type: 'string',
                        },
                        openOnInit: {
                          type: 'boolean',
                        },
                        columns: {
                          type: 'array',
                          items: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                              width: {
                                type: 'string',
                                enum: ['oneThird', 'half', 'twoThirds', 'full'],
                              },
                              alignment: {
                                type: 'string',
                                enum: ['left', 'center', 'right'],
                              },
                              richText: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                },
                              },
                              links: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    link: {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        type: {
                                          type: 'string',
                                          enum: ['reference', 'custom'],
                                        },
                                        label: {
                                          type: 'string',
                                        },
                                        reference: {
                                          oneOf: [
                                            {
                                              type: 'object',
                                              additionalProperties: false,
                                              properties: {
                                                value: {
                                                  oneOf: [
                                                    {
                                                      type: 'string',
                                                    },
                                                    {
                                                      $ref: '#/definitions/pages',
                                                    },
                                                  ],
                                                },
                                                relationTo: {
                                                  const: 'pages',
                                                },
                                              },
                                              required: ['value', 'relationTo'],
                                            },
                                            {
                                              type: 'object',
                                              additionalProperties: false,
                                              properties: {
                                                value: {
                                                  oneOf: [
                                                    {
                                                      type: 'string',
                                                    },
                                                    {
                                                      $ref: '#/definitions/posts',
                                                    },
                                                  ],
                                                },
                                                relationTo: {
                                                  const: 'posts',
                                                },
                                              },
                                              required: ['value', 'relationTo'],
                                            },
                                            {
                                              type: 'object',
                                              additionalProperties: false,
                                              properties: {
                                                value: {
                                                  oneOf: [
                                                    {
                                                      type: 'string',
                                                    },
                                                    {
                                                      $ref: '#/definitions/housing',
                                                    },
                                                  ],
                                                },
                                                relationTo: {
                                                  const: 'housing',
                                                },
                                              },
                                              required: ['value', 'relationTo'],
                                            },
                                          ],
                                        },
                                        url: {
                                          type: 'string',
                                        },
                                      },
                                      required: ['label', 'reference', 'url'],
                                    },
                                    id: {
                                      type: 'string',
                                    },
                                  },
                                  required: [],
                                },
                              },
                              id: {
                                type: 'string',
                              },
                            },
                            required: ['width', 'alignment'],
                          },
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['label'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'accordion',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'blackbaudForm',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  invertColors: {
                    type: 'boolean',
                  },
                  backgroundMedia: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  useOverlay: {
                    type: 'boolean',
                  },
                  richText: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  links: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            appearance: {
                              type: 'string',
                              enum: ['text', 'primaryButton', 'secondaryButton'],
                            },
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            label: {
                              type: 'string',
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['label', 'reference', 'url'],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: [],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'callToAction',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  cardStyle: {
                    type: 'string',
                    enum: ['fullBG', 'insetImage', 'noImage'],
                  },
                  cards: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['reference', 'url'],
                        },
                        media: {
                          oneOf: [
                            {
                              type: 'string',
                            },
                            {
                              $ref: '#/definitions/media',
                            },
                          ],
                        },
                        useOverlay: {
                          type: 'boolean',
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: [],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'cardGrid',
                  },
                },
                required: ['blockType', 'cardStyle'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  backgroundType: {
                    type: 'string',
                    enum: ['light', 'color'],
                  },
                  cardStyle: {
                    type: 'string',
                    enum: ['fullBG', 'insetImage', 'noImage'],
                  },
                  slides: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['reference', 'url'],
                        },
                        media: {
                          oneOf: [
                            {
                              type: 'string',
                            },
                            {
                              $ref: '#/definitions/media',
                            },
                          ],
                        },
                        useOverlay: {
                          type: 'boolean',
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['media'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'cardSlider',
                  },
                },
                required: ['blockType', 'cardStyle'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  media1: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  media2: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  media3: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'careerSearch',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  enableGrayBackground: {
                    type: 'boolean',
                  },
                  columns: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        width: {
                          type: 'string',
                          enum: ['oneThird', 'half', 'twoThirds', 'full'],
                        },
                        alignment: {
                          type: 'string',
                          enum: ['left', 'center', 'right'],
                        },
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        links: {
                          type: 'array',
                          items: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                              link: {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  type: {
                                    type: 'string',
                                    enum: ['reference', 'custom'],
                                  },
                                  label: {
                                    type: 'string',
                                  },
                                  reference: {
                                    oneOf: [
                                      {
                                        type: 'object',
                                        additionalProperties: false,
                                        properties: {
                                          value: {
                                            oneOf: [
                                              {
                                                type: 'string',
                                              },
                                              {
                                                $ref: '#/definitions/pages',
                                              },
                                            ],
                                          },
                                          relationTo: {
                                            const: 'pages',
                                          },
                                        },
                                        required: ['value', 'relationTo'],
                                      },
                                      {
                                        type: 'object',
                                        additionalProperties: false,
                                        properties: {
                                          value: {
                                            oneOf: [
                                              {
                                                type: 'string',
                                              },
                                              {
                                                $ref: '#/definitions/posts',
                                              },
                                            ],
                                          },
                                          relationTo: {
                                            const: 'posts',
                                          },
                                        },
                                        required: ['value', 'relationTo'],
                                      },
                                      {
                                        type: 'object',
                                        additionalProperties: false,
                                        properties: {
                                          value: {
                                            oneOf: [
                                              {
                                                type: 'string',
                                              },
                                              {
                                                $ref: '#/definitions/housing',
                                              },
                                            ],
                                          },
                                          relationTo: {
                                            const: 'housing',
                                          },
                                        },
                                        required: ['value', 'relationTo'],
                                      },
                                    ],
                                  },
                                  url: {
                                    type: 'string',
                                  },
                                },
                                required: ['label', 'reference', 'url'],
                              },
                              id: {
                                type: 'string',
                              },
                            },
                            required: [],
                          },
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['width', 'alignment'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'content',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  cellWidth: {
                    type: 'string',
                    enum: ['two', 'three'],
                  },
                  invertColors: {
                    type: 'boolean',
                  },
                  enableCellNumbers: {
                    type: 'boolean',
                  },
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  cells: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        enableLink: {
                          type: 'boolean',
                        },
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            label: {
                              type: 'string',
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['label', 'reference', 'url'],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: [],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'contentGrid',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  backgroundType: {
                    type: 'string',
                    enum: ['light', 'color'],
                  },
                  slides: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        enableLink: {
                          type: 'boolean',
                        },
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            label: {
                              type: 'string',
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['label', 'reference', 'url'],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: [],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'contentSlider',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'housingMap',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'housingList',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  richText: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  form: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/forms',
                      },
                    ],
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'embeddedForm',
                  },
                },
                required: ['blockType', 'form'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  locations: {
                    type: 'array',
                    items: {
                      oneOf: [
                        {
                          type: 'string',
                        },
                        {
                          $ref: '#/definitions/locations',
                        },
                      ],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'locations',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  media: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  useVimeo: {
                    type: 'boolean',
                  },
                  vimeoID: {
                    type: 'string',
                  },
                  aspectRatio: {
                    type: 'string',
                    enum: ['56.25', '75'],
                  },
                  size: {
                    type: 'string',
                    enum: ['normal', 'wide', 'fullscreen'],
                  },
                  caption: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'media',
                  },
                },
                required: ['blockType', 'media', 'vimeoID'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  collage: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        media: {
                          oneOf: [
                            {
                              type: 'string',
                            },
                            {
                              $ref: '#/definitions/media',
                            },
                          ],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['media'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'mediaCollage',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  alignment: {
                    type: 'string',
                    enum: ['contentOnLeft', 'contentOnRight'],
                  },
                  overlap: {
                    type: 'boolean',
                  },
                  invertColors: {
                    type: 'boolean',
                  },
                  richText: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  media: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  embeddedVideo: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      embed: {
                        type: 'boolean',
                      },
                      poster: {
                        oneOf: [
                          {
                            type: 'string',
                          },
                          {
                            $ref: '#/definitions/media',
                          },
                        ],
                      },
                      platform: {
                        type: 'string',
                        enum: ['youtube', 'vimeo'],
                      },
                      videoID: {
                        type: 'string',
                      },
                      aspectRatio: {
                        type: 'string',
                        enum: ['56.25', '75'],
                      },
                    },
                    required: ['videoID'],
                  },
                  links: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            appearance: {
                              type: 'string',
                              enum: ['text', 'primaryButton', 'secondaryButton'],
                            },
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            label: {
                              type: 'string',
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['label', 'reference', 'url'],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: [],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'mediaContent',
                  },
                },
                required: ['blockType', 'alignment', 'richText', 'media'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  backgroundType: {
                    type: 'string',
                    enum: ['light', 'color'],
                  },
                  slides: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        media: {
                          oneOf: [
                            {
                              type: 'string',
                            },
                            {
                              $ref: '#/definitions/media',
                            },
                          ],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['media'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'mediaSlider',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        label: {
                          type: 'string',
                        },
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        enableLink: {
                          type: 'boolean',
                        },
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            label: {
                              type: 'string',
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['label', 'reference', 'url'],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['label'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'stickyList',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'divider',
                  },
                },
                required: ['blockType'],
              },
            ],
          },
        },
        fullTitle: {
          type: 'string',
        },
        excerpt: {
          type: 'string',
        },
        meta: {
          type: 'object',
          additionalProperties: false,
          properties: {
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            keywords: {
              type: 'string',
            },
            image: {
              oneOf: [
                {
                  type: 'string',
                },
                {
                  $ref: '#/definitions/media',
                },
              ],
            },
          },
          required: [],
        },
        status: {
          type: 'string',
          enum: ['published', 'draft'],
        },
        slug: {
          type: 'string',
        },
        parent: {
          oneOf: [
            {
              type: 'string',
            },
            {
              $ref: '#/definitions/pages',
            },
          ],
        },
        subsite: {
          oneOf: [
            {
              type: 'string',
            },
            {
              $ref: '#/definitions/subsites',
            },
          ],
        },
        color: {
          type: 'string',
          enum: ['green', 'blue', 'red', 'purple'],
        },
        author: {
          oneOf: [
            {
              type: 'string',
            },
            {
              $ref: '#/definitions/users',
            },
          ],
        },
        preview: {
          type: 'string',
        },
      },
      required: ['title'],
    },
    posts: {
      title: 'Post',
      type: 'object',
      additionalProperties: false,
      properties: {
        title: {
          type: 'string',
        },
        hero: {
          type: 'object',
          additionalProperties: false,
          properties: {
            type: {
              type: 'string',
              enum: [
                'basic',
                'content',
                'contentMedia',
                'contentMedia2',
                'contentSidebar',
                'columnsBelow',
                'quickNav',
                'fullscreenBackground',
                'fullscreenSlider',
              ],
            },
            basic: {
              type: 'object',
              additionalProperties: false,
              properties: {
                richText: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
              },
              required: [],
            },
            content: {
              type: 'object',
              additionalProperties: false,
              properties: {
                richText: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
              },
              required: [],
            },
            contentMedia: {
              type: 'object',
              additionalProperties: false,
              properties: {
                richText: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
                media: {
                  oneOf: [
                    {
                      type: 'string',
                    },
                    {
                      $ref: '#/definitions/media',
                    },
                  ],
                },
              },
              required: ['media'],
            },
            contentMedia2: {
              type: 'object',
              additionalProperties: false,
              properties: {
                richText: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
                media: {
                  oneOf: [
                    {
                      type: 'string',
                    },
                    {
                      $ref: '#/definitions/media',
                    },
                  ],
                },
              },
              required: ['media'],
            },
            contentSidebar: {
              type: 'object',
              additionalProperties: false,
              properties: {
                mainContent: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
                sidebarContent: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
              },
              required: [],
            },
            columnsBelow: {
              type: 'object',
              additionalProperties: false,
              properties: {
                backgroundMedia: {
                  oneOf: [
                    {
                      type: 'string',
                    },
                    {
                      $ref: '#/definitions/media',
                    },
                  ],
                },
                useOverlay: {
                  type: 'boolean',
                },
                richText: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
                columns: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      heading: {
                        type: 'string',
                      },
                      description: {
                        type: 'string',
                      },
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: ['heading', 'description'],
                  },
                },
              },
              required: ['backgroundMedia'],
            },
            fullscreenBackground: {
              type: 'object',
              additionalProperties: false,
              properties: {
                invertColors: {
                  type: 'boolean',
                },
                backgroundMedia: {
                  oneOf: [
                    {
                      type: 'string',
                    },
                    {
                      $ref: '#/definitions/media',
                    },
                  ],
                },
                useOverlay: {
                  type: 'boolean',
                },
                richText: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
              },
              required: ['backgroundMedia'],
            },
            quickNav: {
              type: 'object',
              additionalProperties: false,
              properties: {
                invertColors: {
                  type: 'boolean',
                },
                backgroundMedia: {
                  oneOf: [
                    {
                      type: 'string',
                    },
                    {
                      $ref: '#/definitions/media',
                    },
                  ],
                },
                useOverlay: {
                  type: 'boolean',
                },
                richText: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
                columns: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      heading: {
                        type: 'string',
                      },
                      description: {
                        type: 'string',
                      },
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: ['heading', 'description'],
                  },
                },
              },
              required: ['backgroundMedia'],
            },
            fullscreenSlider: {
              type: 'object',
              additionalProperties: false,
              properties: {
                useStaticContent: {
                  type: 'boolean',
                },
                richText: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                links: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      link: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          appearance: {
                            type: 'string',
                            enum: ['text', 'primaryButton', 'secondaryButton'],
                          },
                          type: {
                            type: 'string',
                            enum: ['reference', 'custom'],
                          },
                          label: {
                            type: 'string',
                          },
                          reference: {
                            oneOf: [
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/pages',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'pages',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/posts',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'posts',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                              {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  value: {
                                    oneOf: [
                                      {
                                        type: 'string',
                                      },
                                      {
                                        $ref: '#/definitions/housing',
                                      },
                                    ],
                                  },
                                  relationTo: {
                                    const: 'housing',
                                  },
                                },
                                required: ['value', 'relationTo'],
                              },
                            ],
                          },
                          url: {
                            type: 'string',
                          },
                        },
                        required: ['label', 'reference', 'url'],
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: [],
                  },
                },
                slides: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      backgroundMedia: {
                        oneOf: [
                          {
                            type: 'string',
                          },
                          {
                            $ref: '#/definitions/media',
                          },
                        ],
                      },
                      useOverlay: {
                        type: 'boolean',
                      },
                      richText: {
                        type: 'array',
                        items: {
                          type: 'object',
                        },
                      },
                      links: {
                        type: 'array',
                        items: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            link: {
                              type: 'object',
                              additionalProperties: false,
                              properties: {
                                appearance: {
                                  type: 'string',
                                  enum: ['text', 'primaryButton', 'secondaryButton'],
                                },
                                type: {
                                  type: 'string',
                                  enum: ['reference', 'custom'],
                                },
                                label: {
                                  type: 'string',
                                },
                                reference: {
                                  oneOf: [
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/pages',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'pages',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/posts',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'posts',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/housing',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'housing',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                  ],
                                },
                                url: {
                                  type: 'string',
                                },
                              },
                              required: ['label', 'reference', 'url'],
                            },
                            id: {
                              type: 'string',
                            },
                          },
                          required: [],
                        },
                      },
                      id: {
                        type: 'string',
                      },
                    },
                    required: ['backgroundMedia'],
                  },
                },
              },
              required: [],
            },
          },
          required: ['type'],
        },
        layout: {
          type: 'array',
          items: {
            oneOf: [
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  appearance: {
                    type: 'string',
                    enum: ['default', 'condensed'],
                  },
                  sections: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        label: {
                          type: 'string',
                        },
                        openOnInit: {
                          type: 'boolean',
                        },
                        columns: {
                          type: 'array',
                          items: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                              width: {
                                type: 'string',
                                enum: ['oneThird', 'half', 'twoThirds', 'full'],
                              },
                              alignment: {
                                type: 'string',
                                enum: ['left', 'center', 'right'],
                              },
                              richText: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                },
                              },
                              links: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    link: {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        type: {
                                          type: 'string',
                                          enum: ['reference', 'custom'],
                                        },
                                        label: {
                                          type: 'string',
                                        },
                                        reference: {
                                          oneOf: [
                                            {
                                              type: 'object',
                                              additionalProperties: false,
                                              properties: {
                                                value: {
                                                  oneOf: [
                                                    {
                                                      type: 'string',
                                                    },
                                                    {
                                                      $ref: '#/definitions/pages',
                                                    },
                                                  ],
                                                },
                                                relationTo: {
                                                  const: 'pages',
                                                },
                                              },
                                              required: ['value', 'relationTo'],
                                            },
                                            {
                                              type: 'object',
                                              additionalProperties: false,
                                              properties: {
                                                value: {
                                                  oneOf: [
                                                    {
                                                      type: 'string',
                                                    },
                                                    {
                                                      $ref: '#/definitions/posts',
                                                    },
                                                  ],
                                                },
                                                relationTo: {
                                                  const: 'posts',
                                                },
                                              },
                                              required: ['value', 'relationTo'],
                                            },
                                            {
                                              type: 'object',
                                              additionalProperties: false,
                                              properties: {
                                                value: {
                                                  oneOf: [
                                                    {
                                                      type: 'string',
                                                    },
                                                    {
                                                      $ref: '#/definitions/housing',
                                                    },
                                                  ],
                                                },
                                                relationTo: {
                                                  const: 'housing',
                                                },
                                              },
                                              required: ['value', 'relationTo'],
                                            },
                                          ],
                                        },
                                        url: {
                                          type: 'string',
                                        },
                                      },
                                      required: ['label', 'reference', 'url'],
                                    },
                                    id: {
                                      type: 'string',
                                    },
                                  },
                                  required: [],
                                },
                              },
                              id: {
                                type: 'string',
                              },
                            },
                            required: ['width', 'alignment'],
                          },
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['label'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'accordion',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'blackbaudForm',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  invertColors: {
                    type: 'boolean',
                  },
                  backgroundMedia: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  useOverlay: {
                    type: 'boolean',
                  },
                  richText: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  links: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            appearance: {
                              type: 'string',
                              enum: ['text', 'primaryButton', 'secondaryButton'],
                            },
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            label: {
                              type: 'string',
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['label', 'reference', 'url'],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: [],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'callToAction',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  cardStyle: {
                    type: 'string',
                    enum: ['fullBG', 'insetImage', 'noImage'],
                  },
                  cards: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['reference', 'url'],
                        },
                        media: {
                          oneOf: [
                            {
                              type: 'string',
                            },
                            {
                              $ref: '#/definitions/media',
                            },
                          ],
                        },
                        useOverlay: {
                          type: 'boolean',
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: [],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'cardGrid',
                  },
                },
                required: ['blockType', 'cardStyle'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  backgroundType: {
                    type: 'string',
                    enum: ['light', 'color'],
                  },
                  cardStyle: {
                    type: 'string',
                    enum: ['fullBG', 'insetImage', 'noImage'],
                  },
                  slides: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['reference', 'url'],
                        },
                        media: {
                          oneOf: [
                            {
                              type: 'string',
                            },
                            {
                              $ref: '#/definitions/media',
                            },
                          ],
                        },
                        useOverlay: {
                          type: 'boolean',
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['media'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'cardSlider',
                  },
                },
                required: ['blockType', 'cardStyle'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  media1: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  media2: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  media3: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'careerSearch',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  enableGrayBackground: {
                    type: 'boolean',
                  },
                  columns: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        width: {
                          type: 'string',
                          enum: ['oneThird', 'half', 'twoThirds', 'full'],
                        },
                        alignment: {
                          type: 'string',
                          enum: ['left', 'center', 'right'],
                        },
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        links: {
                          type: 'array',
                          items: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                              link: {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  type: {
                                    type: 'string',
                                    enum: ['reference', 'custom'],
                                  },
                                  label: {
                                    type: 'string',
                                  },
                                  reference: {
                                    oneOf: [
                                      {
                                        type: 'object',
                                        additionalProperties: false,
                                        properties: {
                                          value: {
                                            oneOf: [
                                              {
                                                type: 'string',
                                              },
                                              {
                                                $ref: '#/definitions/pages',
                                              },
                                            ],
                                          },
                                          relationTo: {
                                            const: 'pages',
                                          },
                                        },
                                        required: ['value', 'relationTo'],
                                      },
                                      {
                                        type: 'object',
                                        additionalProperties: false,
                                        properties: {
                                          value: {
                                            oneOf: [
                                              {
                                                type: 'string',
                                              },
                                              {
                                                $ref: '#/definitions/posts',
                                              },
                                            ],
                                          },
                                          relationTo: {
                                            const: 'posts',
                                          },
                                        },
                                        required: ['value', 'relationTo'],
                                      },
                                      {
                                        type: 'object',
                                        additionalProperties: false,
                                        properties: {
                                          value: {
                                            oneOf: [
                                              {
                                                type: 'string',
                                              },
                                              {
                                                $ref: '#/definitions/housing',
                                              },
                                            ],
                                          },
                                          relationTo: {
                                            const: 'housing',
                                          },
                                        },
                                        required: ['value', 'relationTo'],
                                      },
                                    ],
                                  },
                                  url: {
                                    type: 'string',
                                  },
                                },
                                required: ['label', 'reference', 'url'],
                              },
                              id: {
                                type: 'string',
                              },
                            },
                            required: [],
                          },
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['width', 'alignment'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'content',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  cellWidth: {
                    type: 'string',
                    enum: ['two', 'three'],
                  },
                  invertColors: {
                    type: 'boolean',
                  },
                  enableCellNumbers: {
                    type: 'boolean',
                  },
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  cells: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        enableLink: {
                          type: 'boolean',
                        },
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            label: {
                              type: 'string',
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['label', 'reference', 'url'],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: [],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'contentGrid',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  backgroundType: {
                    type: 'string',
                    enum: ['light', 'color'],
                  },
                  slides: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        enableLink: {
                          type: 'boolean',
                        },
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            label: {
                              type: 'string',
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['label', 'reference', 'url'],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: [],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'contentSlider',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  richText: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  form: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/forms',
                      },
                    ],
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'embeddedForm',
                  },
                },
                required: ['blockType', 'form'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'housingMap',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'housingList',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  locations: {
                    type: 'array',
                    items: {
                      oneOf: [
                        {
                          type: 'string',
                        },
                        {
                          $ref: '#/definitions/locations',
                        },
                      ],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'locations',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  media: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  useVimeo: {
                    type: 'boolean',
                  },
                  vimeoID: {
                    type: 'string',
                  },
                  aspectRatio: {
                    type: 'string',
                    enum: ['56.25', '75'],
                  },
                  size: {
                    type: 'string',
                    enum: ['normal', 'wide', 'fullscreen'],
                  },
                  caption: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'media',
                  },
                },
                required: ['blockType', 'media', 'vimeoID'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  collage: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        media: {
                          oneOf: [
                            {
                              type: 'string',
                            },
                            {
                              $ref: '#/definitions/media',
                            },
                          ],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['media'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'mediaCollage',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  alignment: {
                    type: 'string',
                    enum: ['contentOnLeft', 'contentOnRight'],
                  },
                  overlap: {
                    type: 'boolean',
                  },
                  invertColors: {
                    type: 'boolean',
                  },
                  richText: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  media: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  embeddedVideo: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      embed: {
                        type: 'boolean',
                      },
                      poster: {
                        oneOf: [
                          {
                            type: 'string',
                          },
                          {
                            $ref: '#/definitions/media',
                          },
                        ],
                      },
                      platform: {
                        type: 'string',
                        enum: ['youtube', 'vimeo'],
                      },
                      videoID: {
                        type: 'string',
                      },
                      aspectRatio: {
                        type: 'string',
                        enum: ['56.25', '75'],
                      },
                    },
                    required: ['videoID'],
                  },
                  links: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            appearance: {
                              type: 'string',
                              enum: ['text', 'primaryButton', 'secondaryButton'],
                            },
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            label: {
                              type: 'string',
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['label', 'reference', 'url'],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: [],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'mediaContent',
                  },
                },
                required: ['blockType', 'alignment', 'richText', 'media'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  backgroundType: {
                    type: 'string',
                    enum: ['light', 'color'],
                  },
                  slides: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        media: {
                          oneOf: [
                            {
                              type: 'string',
                            },
                            {
                              $ref: '#/definitions/media',
                            },
                          ],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['media'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'mediaSlider',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        label: {
                          type: 'string',
                        },
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        enableLink: {
                          type: 'boolean',
                        },
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            label: {
                              type: 'string',
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['label', 'reference', 'url'],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['label'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'stickyList',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'divider',
                  },
                },
                required: ['blockType'],
              },
            ],
          },
        },
        slug: {
          type: 'string',
        },
        category: {
          oneOf: [
            {
              type: 'string',
            },
            {
              $ref: '#/definitions/post-categories',
            },
          ],
        },
        subsite: {
          oneOf: [
            {
              type: 'string',
            },
            {
              $ref: '#/definitions/subsites',
            },
          ],
        },
        meta: {
          type: 'object',
          additionalProperties: false,
          properties: {
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            keywords: {
              type: 'string',
            },
            image: {
              oneOf: [
                {
                  type: 'string',
                },
                {
                  $ref: '#/definitions/media',
                },
              ],
            },
          },
          required: [],
        },
      },
      required: ['title', 'category'],
    },
    'post-categories': {
      title: 'Post Category',
      type: 'object',
      additionalProperties: false,
      properties: {
        title: {
          type: 'string',
        },
        color: {
          type: 'string',
          enum: ['green', 'blue', 'red', 'purple'],
        },
        slug: {
          type: 'string',
        },
        subsite: {
          oneOf: [
            {
              type: 'string',
            },
            {
              $ref: '#/definitions/subsites',
            },
          ],
        },
      },
      required: ['title'],
    },
    housing: {
      title: 'Housing',
      type: 'object',
      additionalProperties: false,
      properties: {
        title: {
          type: 'string',
        },
        address: {
          type: 'object',
          additionalProperties: false,
          properties: {
            line1: {
              type: 'string',
            },
            line2: {
              type: 'string',
            },
            city: {
              type: 'string',
            },
            state: {
              type: 'string',
              enum: [
                'None',
                'Alabama',
                'Alaska',
                'Arizona',
                'Arkansas',
                'California',
                'Colorado',
                'Connecticut',
                'Delaware',
                'Florida',
                'Georgia',
                'Hawaii',
                'Idaho',
                'Illinois',
                'Indiana',
                'Iowa',
                'Kansas',
                'Kentucky',
                'Louisiana',
                'Maine',
                'Maryland',
                'Massachusetts',
                'Michigan',
                'Minnesota',
                'Mississippi',
                'Missouri',
                'Montana',
                'Nebraska',
                'Nevada',
                'New Hampshire',
                'New Jersey',
                'New Mexico',
                'New York',
                'North Carolina',
                'North Dakota',
                'Ohio',
                'Oklahoma',
                'Oregon',
                'Pennsylvania',
                'Rhode Island',
                'South Carolina',
                'South Dakota',
                'Tennessee',
                'Texas',
                'Utah',
                'Vermont',
                'Virginia',
                'Washington',
                'West Virginia',
                'Wisconsin',
                'Wyoming',
              ],
            },
            zip: {
              type: 'string',
            },
            coords: {
              type: 'object',
              additionalProperties: false,
              properties: {
                lat: {
                  type: 'number',
                },
                lng: {
                  type: 'number',
                },
              },
              required: [],
            },
          },
          required: [],
        },
        contacts: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              type: {
                type: 'string',
                enum: ['mailto', 'tel', 'fax'],
              },
              label: {
                type: 'string',
              },
              value: {
                type: 'string',
              },
              id: {
                type: 'string',
              },
            },
            required: [],
          },
        },
        layout: {
          type: 'array',
          items: {
            oneOf: [
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  appearance: {
                    type: 'string',
                    enum: ['default', 'condensed'],
                  },
                  sections: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        label: {
                          type: 'string',
                        },
                        openOnInit: {
                          type: 'boolean',
                        },
                        columns: {
                          type: 'array',
                          items: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                              width: {
                                type: 'string',
                                enum: ['oneThird', 'half', 'twoThirds', 'full'],
                              },
                              alignment: {
                                type: 'string',
                                enum: ['left', 'center', 'right'],
                              },
                              richText: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                },
                              },
                              links: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    link: {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        type: {
                                          type: 'string',
                                          enum: ['reference', 'custom'],
                                        },
                                        label: {
                                          type: 'string',
                                        },
                                        reference: {
                                          oneOf: [
                                            {
                                              type: 'object',
                                              additionalProperties: false,
                                              properties: {
                                                value: {
                                                  oneOf: [
                                                    {
                                                      type: 'string',
                                                    },
                                                    {
                                                      $ref: '#/definitions/pages',
                                                    },
                                                  ],
                                                },
                                                relationTo: {
                                                  const: 'pages',
                                                },
                                              },
                                              required: ['value', 'relationTo'],
                                            },
                                            {
                                              type: 'object',
                                              additionalProperties: false,
                                              properties: {
                                                value: {
                                                  oneOf: [
                                                    {
                                                      type: 'string',
                                                    },
                                                    {
                                                      $ref: '#/definitions/posts',
                                                    },
                                                  ],
                                                },
                                                relationTo: {
                                                  const: 'posts',
                                                },
                                              },
                                              required: ['value', 'relationTo'],
                                            },
                                            {
                                              type: 'object',
                                              additionalProperties: false,
                                              properties: {
                                                value: {
                                                  oneOf: [
                                                    {
                                                      type: 'string',
                                                    },
                                                    {
                                                      $ref: '#/definitions/housing',
                                                    },
                                                  ],
                                                },
                                                relationTo: {
                                                  const: 'housing',
                                                },
                                              },
                                              required: ['value', 'relationTo'],
                                            },
                                          ],
                                        },
                                        url: {
                                          type: 'string',
                                        },
                                      },
                                      required: ['label', 'reference', 'url'],
                                    },
                                    id: {
                                      type: 'string',
                                    },
                                  },
                                  required: [],
                                },
                              },
                              id: {
                                type: 'string',
                              },
                            },
                            required: ['width', 'alignment'],
                          },
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['label'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'accordion',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  invertColors: {
                    type: 'boolean',
                  },
                  backgroundMedia: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  useOverlay: {
                    type: 'boolean',
                  },
                  richText: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  links: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            appearance: {
                              type: 'string',
                              enum: ['text', 'primaryButton', 'secondaryButton'],
                            },
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            label: {
                              type: 'string',
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['label', 'reference', 'url'],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: [],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'callToAction',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  cardStyle: {
                    type: 'string',
                    enum: ['fullBG', 'insetImage', 'noImage'],
                  },
                  cards: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['reference', 'url'],
                        },
                        media: {
                          oneOf: [
                            {
                              type: 'string',
                            },
                            {
                              $ref: '#/definitions/media',
                            },
                          ],
                        },
                        useOverlay: {
                          type: 'boolean',
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: [],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'cardGrid',
                  },
                },
                required: ['blockType', 'cardStyle'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  backgroundType: {
                    type: 'string',
                    enum: ['light', 'color'],
                  },
                  cardStyle: {
                    type: 'string',
                    enum: ['fullBG', 'insetImage', 'noImage'],
                  },
                  slides: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['reference', 'url'],
                        },
                        media: {
                          oneOf: [
                            {
                              type: 'string',
                            },
                            {
                              $ref: '#/definitions/media',
                            },
                          ],
                        },
                        useOverlay: {
                          type: 'boolean',
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['media'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'cardSlider',
                  },
                },
                required: ['blockType', 'cardStyle'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  media1: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  media2: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  media3: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'careerSearch',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  enableGrayBackground: {
                    type: 'boolean',
                  },
                  columns: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        width: {
                          type: 'string',
                          enum: ['oneThird', 'half', 'twoThirds', 'full'],
                        },
                        alignment: {
                          type: 'string',
                          enum: ['left', 'center', 'right'],
                        },
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        links: {
                          type: 'array',
                          items: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                              link: {
                                type: 'object',
                                additionalProperties: false,
                                properties: {
                                  type: {
                                    type: 'string',
                                    enum: ['reference', 'custom'],
                                  },
                                  label: {
                                    type: 'string',
                                  },
                                  reference: {
                                    oneOf: [
                                      {
                                        type: 'object',
                                        additionalProperties: false,
                                        properties: {
                                          value: {
                                            oneOf: [
                                              {
                                                type: 'string',
                                              },
                                              {
                                                $ref: '#/definitions/pages',
                                              },
                                            ],
                                          },
                                          relationTo: {
                                            const: 'pages',
                                          },
                                        },
                                        required: ['value', 'relationTo'],
                                      },
                                      {
                                        type: 'object',
                                        additionalProperties: false,
                                        properties: {
                                          value: {
                                            oneOf: [
                                              {
                                                type: 'string',
                                              },
                                              {
                                                $ref: '#/definitions/posts',
                                              },
                                            ],
                                          },
                                          relationTo: {
                                            const: 'posts',
                                          },
                                        },
                                        required: ['value', 'relationTo'],
                                      },
                                      {
                                        type: 'object',
                                        additionalProperties: false,
                                        properties: {
                                          value: {
                                            oneOf: [
                                              {
                                                type: 'string',
                                              },
                                              {
                                                $ref: '#/definitions/housing',
                                              },
                                            ],
                                          },
                                          relationTo: {
                                            const: 'housing',
                                          },
                                        },
                                        required: ['value', 'relationTo'],
                                      },
                                    ],
                                  },
                                  url: {
                                    type: 'string',
                                  },
                                },
                                required: ['label', 'reference', 'url'],
                              },
                              id: {
                                type: 'string',
                              },
                            },
                            required: [],
                          },
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['width', 'alignment'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'content',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  cellWidth: {
                    type: 'string',
                    enum: ['two', 'three'],
                  },
                  invertColors: {
                    type: 'boolean',
                  },
                  enableCellNumbers: {
                    type: 'boolean',
                  },
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  cells: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        enableLink: {
                          type: 'boolean',
                        },
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            label: {
                              type: 'string',
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['label', 'reference', 'url'],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: [],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'contentGrid',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  backgroundType: {
                    type: 'string',
                    enum: ['light', 'color'],
                  },
                  slides: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        enableLink: {
                          type: 'boolean',
                        },
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            label: {
                              type: 'string',
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['label', 'reference', 'url'],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: [],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'contentSlider',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  richText: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  form: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/forms',
                      },
                    ],
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'embeddedForm',
                  },
                },
                required: ['blockType', 'form'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  locations: {
                    type: 'array',
                    items: {
                      oneOf: [
                        {
                          type: 'string',
                        },
                        {
                          $ref: '#/definitions/locations',
                        },
                      ],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'locations',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  media: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  useVimeo: {
                    type: 'boolean',
                  },
                  vimeoID: {
                    type: 'string',
                  },
                  aspectRatio: {
                    type: 'string',
                    enum: ['56.25', '75'],
                  },
                  size: {
                    type: 'string',
                    enum: ['normal', 'wide', 'fullscreen'],
                  },
                  caption: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'media',
                  },
                },
                required: ['blockType', 'media', 'vimeoID'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  collage: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        media: {
                          oneOf: [
                            {
                              type: 'string',
                            },
                            {
                              $ref: '#/definitions/media',
                            },
                          ],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['media'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'mediaCollage',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  alignment: {
                    type: 'string',
                    enum: ['contentOnLeft', 'contentOnRight'],
                  },
                  overlap: {
                    type: 'boolean',
                  },
                  invertColors: {
                    type: 'boolean',
                  },
                  richText: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  media: {
                    oneOf: [
                      {
                        type: 'string',
                      },
                      {
                        $ref: '#/definitions/media',
                      },
                    ],
                  },
                  embeddedVideo: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      embed: {
                        type: 'boolean',
                      },
                      poster: {
                        oneOf: [
                          {
                            type: 'string',
                          },
                          {
                            $ref: '#/definitions/media',
                          },
                        ],
                      },
                      platform: {
                        type: 'string',
                        enum: ['youtube', 'vimeo'],
                      },
                      videoID: {
                        type: 'string',
                      },
                      aspectRatio: {
                        type: 'string',
                        enum: ['56.25', '75'],
                      },
                    },
                    required: ['videoID'],
                  },
                  links: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            appearance: {
                              type: 'string',
                              enum: ['text', 'primaryButton', 'secondaryButton'],
                            },
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            label: {
                              type: 'string',
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['label', 'reference', 'url'],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: [],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'mediaContent',
                  },
                },
                required: ['blockType', 'alignment', 'richText', 'media'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  introContent: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  backgroundType: {
                    type: 'string',
                    enum: ['light', 'color'],
                  },
                  slides: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        media: {
                          oneOf: [
                            {
                              type: 'string',
                            },
                            {
                              $ref: '#/definitions/media',
                            },
                          ],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['media'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'mediaSlider',
                  },
                },
                required: ['blockType'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        label: {
                          type: 'string',
                        },
                        richText: {
                          type: 'array',
                          items: {
                            type: 'object',
                          },
                        },
                        enableLink: {
                          type: 'boolean',
                        },
                        link: {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['reference', 'custom'],
                            },
                            label: {
                              type: 'string',
                            },
                            reference: {
                              oneOf: [
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/pages',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'pages',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/posts',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'posts',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                                {
                                  type: 'object',
                                  additionalProperties: false,
                                  properties: {
                                    value: {
                                      oneOf: [
                                        {
                                          type: 'string',
                                        },
                                        {
                                          $ref: '#/definitions/housing',
                                        },
                                      ],
                                    },
                                    relationTo: {
                                      const: 'housing',
                                    },
                                  },
                                  required: ['value', 'relationTo'],
                                },
                              ],
                            },
                            url: {
                              type: 'string',
                            },
                          },
                          required: ['label', 'reference', 'url'],
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['label'],
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'stickyList',
                  },
                },
                required: ['blockType'],
              },
            ],
          },
        },
        meta: {
          type: 'object',
          additionalProperties: false,
          properties: {
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            keywords: {
              type: 'string',
            },
            image: {
              oneOf: [
                {
                  type: 'string',
                },
                {
                  $ref: '#/definitions/media',
                },
              ],
            },
          },
          required: [],
        },
        slug: {
          type: 'string',
        },
        categories: {
          type: 'array',
          items: {
            oneOf: [
              {
                type: 'string',
              },
              {
                $ref: '#/definitions/housing-categories',
              },
            ],
          },
        },
        subsite: {
          oneOf: [
            {
              type: 'string',
            },
            {
              $ref: '#/definitions/subsites',
            },
          ],
        },
      },
      required: ['title'],
    },
    'housing-categories': {
      title: 'Housing Category',
      type: 'object',
      additionalProperties: false,
      properties: {
        title: {
          type: 'string',
        },
        slug: {
          type: 'string',
        },
      },
      required: ['title'],
    },
    locations: {
      title: 'Location',
      type: 'object',
      additionalProperties: false,
      properties: {
        name: {
          type: 'string',
        },
        address: {
          type: 'object',
          additionalProperties: false,
          properties: {
            line1: {
              type: 'string',
            },
            line2: {
              type: 'string',
            },
            city: {
              type: 'string',
            },
            state: {
              type: 'string',
              enum: [
                'None',
                'Alabama',
                'Alaska',
                'Arizona',
                'Arkansas',
                'California',
                'Colorado',
                'Connecticut',
                'Delaware',
                'Florida',
                'Georgia',
                'Hawaii',
                'Idaho',
                'Illinois',
                'Indiana',
                'Iowa',
                'Kansas',
                'Kentucky',
                'Louisiana',
                'Maine',
                'Maryland',
                'Massachusetts',
                'Michigan',
                'Minnesota',
                'Mississippi',
                'Missouri',
                'Montana',
                'Nebraska',
                'Nevada',
                'New Hampshire',
                'New Jersey',
                'New Mexico',
                'New York',
                'North Carolina',
                'North Dakota',
                'Ohio',
                'Oklahoma',
                'Oregon',
                'Pennsylvania',
                'Rhode Island',
                'South Carolina',
                'South Dakota',
                'Tennessee',
                'Texas',
                'Utah',
                'Vermont',
                'Virginia',
                'Washington',
                'West Virginia',
                'Wisconsin',
                'Wyoming',
              ],
            },
            zip: {
              type: 'string',
            },
            coords: {
              type: 'object',
              additionalProperties: false,
              properties: {
                lat: {
                  type: 'number',
                },
                lng: {
                  type: 'number',
                },
              },
              required: [],
            },
          },
          required: [],
        },
        contacts: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              type: {
                type: 'string',
                enum: ['mailto', 'tel', 'fax'],
              },
              label: {
                type: 'string',
              },
              value: {
                type: 'string',
              },
              id: {
                type: 'string',
              },
            },
            required: [],
          },
        },
        meta: {
          type: 'object',
          additionalProperties: false,
          properties: {
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            keywords: {
              type: 'string',
            },
            image: {
              oneOf: [
                {
                  type: 'string',
                },
                {
                  $ref: '#/definitions/media',
                },
              ],
            },
          },
          required: [],
        },
      },
      required: ['name'],
    },
    subsites: {
      title: 'Subsite',
      type: 'object',
      additionalProperties: false,
      properties: {
        title: {
          type: 'string',
        },
        menuItems: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              type: {
                type: 'string',
                enum: ['link', 'subMenu'],
              },
              link: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  type: {
                    type: 'string',
                    enum: ['reference', 'custom'],
                  },
                  label: {
                    type: 'string',
                  },
                  reference: {
                    oneOf: [
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/pages',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'pages',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/posts',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'posts',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/housing',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'housing',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                    ],
                  },
                  url: {
                    type: 'string',
                  },
                },
                required: ['label', 'reference', 'url'],
              },
              label: {
                type: 'string',
              },
              subMenu: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  column1: {
                    type: 'array',
                    items: {
                      oneOf: [
                        {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            appearance: {
                              type: 'string',
                              enum: ['primary', 'secondary', 'arrow'],
                            },
                            link: {
                              type: 'object',
                              additionalProperties: false,
                              properties: {
                                type: {
                                  type: 'string',
                                  enum: ['reference', 'custom'],
                                },
                                label: {
                                  type: 'string',
                                },
                                reference: {
                                  oneOf: [
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/pages',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'pages',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/posts',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'posts',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/housing',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'housing',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                  ],
                                },
                                url: {
                                  type: 'string',
                                },
                              },
                              required: ['label', 'reference', 'url'],
                            },
                            id: {
                              type: 'string',
                            },
                            blockName: {
                              type: 'string',
                            },
                            blockType: {
                              const: 'menuLink',
                            },
                          },
                          required: ['blockType'],
                        },
                        {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            content: {
                              type: 'string',
                            },
                            id: {
                              type: 'string',
                            },
                            blockName: {
                              type: 'string',
                            },
                            blockType: {
                              const: 'menuDescription',
                            },
                          },
                          required: ['blockType', 'content'],
                        },
                        {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            media: {
                              oneOf: [
                                {
                                  type: 'string',
                                },
                                {
                                  $ref: '#/definitions/media',
                                },
                              ],
                            },
                            headline: {
                              type: 'string',
                            },
                            link: {
                              type: 'object',
                              additionalProperties: false,
                              properties: {
                                type: {
                                  type: 'string',
                                  enum: ['reference', 'custom'],
                                },
                                reference: {
                                  oneOf: [
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/pages',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'pages',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/posts',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'posts',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/housing',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'housing',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                  ],
                                },
                                url: {
                                  type: 'string',
                                },
                              },
                              required: ['reference', 'url'],
                            },
                            id: {
                              type: 'string',
                            },
                            blockName: {
                              type: 'string',
                            },
                            blockType: {
                              const: 'menuFeature',
                            },
                          },
                          required: ['blockType', 'media', 'headline'],
                        },
                      ],
                    },
                  },
                  enableColumn2: {
                    type: 'boolean',
                  },
                  column2: {
                    type: 'array',
                    items: {
                      oneOf: [
                        {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            appearance: {
                              type: 'string',
                              enum: ['primary', 'secondary', 'arrow'],
                            },
                            link: {
                              type: 'object',
                              additionalProperties: false,
                              properties: {
                                type: {
                                  type: 'string',
                                  enum: ['reference', 'custom'],
                                },
                                label: {
                                  type: 'string',
                                },
                                reference: {
                                  oneOf: [
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/pages',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'pages',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/posts',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'posts',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/housing',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'housing',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                  ],
                                },
                                url: {
                                  type: 'string',
                                },
                              },
                              required: ['label', 'reference', 'url'],
                            },
                            id: {
                              type: 'string',
                            },
                            blockName: {
                              type: 'string',
                            },
                            blockType: {
                              const: 'menuLink',
                            },
                          },
                          required: ['blockType'],
                        },
                        {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            content: {
                              type: 'string',
                            },
                            id: {
                              type: 'string',
                            },
                            blockName: {
                              type: 'string',
                            },
                            blockType: {
                              const: 'menuDescription',
                            },
                          },
                          required: ['blockType', 'content'],
                        },
                        {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            media: {
                              oneOf: [
                                {
                                  type: 'string',
                                },
                                {
                                  $ref: '#/definitions/media',
                                },
                              ],
                            },
                            headline: {
                              type: 'string',
                            },
                            link: {
                              type: 'object',
                              additionalProperties: false,
                              properties: {
                                type: {
                                  type: 'string',
                                  enum: ['reference', 'custom'],
                                },
                                reference: {
                                  oneOf: [
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/pages',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'pages',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/posts',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'posts',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/housing',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'housing',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                  ],
                                },
                                url: {
                                  type: 'string',
                                },
                              },
                              required: ['reference', 'url'],
                            },
                            id: {
                              type: 'string',
                            },
                            blockName: {
                              type: 'string',
                            },
                            blockType: {
                              const: 'menuFeature',
                            },
                          },
                          required: ['blockType', 'media', 'headline'],
                        },
                      ],
                    },
                  },
                  enableColumn3: {
                    type: 'boolean',
                  },
                  column3: {
                    type: 'array',
                    items: {
                      oneOf: [
                        {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            appearance: {
                              type: 'string',
                              enum: ['primary', 'secondary', 'arrow'],
                            },
                            link: {
                              type: 'object',
                              additionalProperties: false,
                              properties: {
                                type: {
                                  type: 'string',
                                  enum: ['reference', 'custom'],
                                },
                                label: {
                                  type: 'string',
                                },
                                reference: {
                                  oneOf: [
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/pages',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'pages',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/posts',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'posts',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/housing',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'housing',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                  ],
                                },
                                url: {
                                  type: 'string',
                                },
                              },
                              required: ['label', 'reference', 'url'],
                            },
                            id: {
                              type: 'string',
                            },
                            blockName: {
                              type: 'string',
                            },
                            blockType: {
                              const: 'menuLink',
                            },
                          },
                          required: ['blockType'],
                        },
                        {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            content: {
                              type: 'string',
                            },
                            id: {
                              type: 'string',
                            },
                            blockName: {
                              type: 'string',
                            },
                            blockType: {
                              const: 'menuDescription',
                            },
                          },
                          required: ['blockType', 'content'],
                        },
                        {
                          type: 'object',
                          additionalProperties: false,
                          properties: {
                            media: {
                              oneOf: [
                                {
                                  type: 'string',
                                },
                                {
                                  $ref: '#/definitions/media',
                                },
                              ],
                            },
                            headline: {
                              type: 'string',
                            },
                            link: {
                              type: 'object',
                              additionalProperties: false,
                              properties: {
                                type: {
                                  type: 'string',
                                  enum: ['reference', 'custom'],
                                },
                                reference: {
                                  oneOf: [
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/pages',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'pages',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/posts',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'posts',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                    {
                                      type: 'object',
                                      additionalProperties: false,
                                      properties: {
                                        value: {
                                          oneOf: [
                                            {
                                              type: 'string',
                                            },
                                            {
                                              $ref: '#/definitions/housing',
                                            },
                                          ],
                                        },
                                        relationTo: {
                                          const: 'housing',
                                        },
                                      },
                                      required: ['value', 'relationTo'],
                                    },
                                  ],
                                },
                                url: {
                                  type: 'string',
                                },
                              },
                              required: ['reference', 'url'],
                            },
                            id: {
                              type: 'string',
                            },
                            blockName: {
                              type: 'string',
                            },
                            blockType: {
                              const: 'menuFeature',
                            },
                          },
                          required: ['blockType', 'media', 'headline'],
                        },
                      ],
                    },
                  },
                },
                required: [],
              },
              id: {
                type: 'string',
              },
            },
            required: ['label'],
          },
        },
        slug: {
          type: 'string',
        },
        color: {
          type: 'string',
          enum: ['green', 'blue', 'red', 'purple'],
        },
        home: {
          oneOf: [
            {
              type: 'string',
            },
            {
              $ref: '#/definitions/pages',
            },
          ],
        },
      },
      required: ['title', 'home'],
    },
    alerts: {
      title: 'Alert',
      type: 'object',
      additionalProperties: false,
      properties: {
        placement: {
          type: 'string',
          enum: ['global', 'subsite'],
        },
        subsites: {
          type: 'array',
          items: {
            oneOf: [
              {
                type: 'string',
              },
              {
                $ref: '#/definitions/subsites',
              },
            ],
          },
        },
        backgroundColor: {
          type: 'string',
          enum: ['matchTheme', 'green', 'blue', 'red', 'purple'],
        },
        content: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        links: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              link: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  appearance: {
                    type: 'string',
                    enum: ['text', 'primaryButton', 'secondaryButton'],
                  },
                  type: {
                    type: 'string',
                    enum: ['reference', 'custom'],
                  },
                  label: {
                    type: 'string',
                  },
                  reference: {
                    oneOf: [
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/pages',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'pages',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/posts',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'posts',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                      {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                          value: {
                            oneOf: [
                              {
                                type: 'string',
                              },
                              {
                                $ref: '#/definitions/housing',
                              },
                            ],
                          },
                          relationTo: {
                            const: 'housing',
                          },
                        },
                        required: ['value', 'relationTo'],
                      },
                    ],
                  },
                  url: {
                    type: 'string',
                  },
                },
                required: ['label', 'reference', 'url'],
              },
              id: {
                type: 'string',
              },
            },
            required: [],
          },
        },
      },
      required: ['placement', 'subsites', 'content'],
    },
    search: {
      title: 'Search Result',
      type: 'object',
      additionalProperties: false,
      properties: {
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        keywords: {
          type: 'string',
        },
        slug: {
          type: 'string',
        },
        media: {
          oneOf: [
            {
              type: 'string',
            },
            {
              $ref: '#/definitions/media',
            },
          ],
        },
        doc: {
          oneOf: [
            {
              type: 'object',
              additionalProperties: false,
              properties: {
                value: {
                  oneOf: [
                    {
                      type: 'string',
                    },
                    {
                      $ref: '#/definitions/pages',
                    },
                  ],
                },
                relationTo: {
                  const: 'pages',
                },
              },
              required: ['value', 'relationTo'],
            },
            {
              type: 'object',
              additionalProperties: false,
              properties: {
                value: {
                  oneOf: [
                    {
                      type: 'string',
                    },
                    {
                      $ref: '#/definitions/posts',
                    },
                  ],
                },
                relationTo: {
                  const: 'posts',
                },
              },
              required: ['value', 'relationTo'],
            },
            {
              type: 'object',
              additionalProperties: false,
              properties: {
                value: {
                  oneOf: [
                    {
                      type: 'string',
                    },
                    {
                      $ref: '#/definitions/housing',
                    },
                  ],
                },
                relationTo: {
                  const: 'housing',
                },
              },
              required: ['value', 'relationTo'],
            },
            {
              type: 'object',
              additionalProperties: false,
              properties: {
                value: {
                  oneOf: [
                    {
                      type: 'string',
                    },
                    {
                      $ref: '#/definitions/people',
                    },
                  ],
                },
                relationTo: {
                  const: 'people',
                },
              },
              required: ['value', 'relationTo'],
            },
            {
              type: 'object',
              additionalProperties: false,
              properties: {
                value: {
                  oneOf: [
                    {
                      type: 'string',
                    },
                    {
                      $ref: '#/definitions/locations',
                    },
                  ],
                },
                relationTo: {
                  const: 'locations',
                },
              },
              required: ['value', 'relationTo'],
            },
          ],
        },
      },
      required: ['title', 'slug', 'doc'],
    },
    media: {
      title: 'Media',
      type: 'object',
      additionalProperties: false,
      properties: {
        url: {
          type: 'string',
        },
        filename: {
          type: 'string',
        },
        mimeType: {
          type: 'string',
        },
        filesize: {
          type: 'number',
        },
        width: {
          type: 'number',
        },
        height: {
          type: 'number',
        },
        sizes: {
          type: 'object',
          additionalProperties: false,
          properties: {
            thumbnail: {
              type: 'object',
              additionalProperties: false,
              properties: {
                url: {
                  type: 'string',
                },
                width: {
                  type: 'number',
                },
                height: {
                  type: 'number',
                },
                mimeType: {
                  type: 'string',
                },
                filesize: {
                  type: 'number',
                },
                filename: {
                  type: 'string',
                },
              },
              required: [],
            },
            card: {
              type: 'object',
              additionalProperties: false,
              properties: {
                url: {
                  type: 'string',
                },
                width: {
                  type: 'number',
                },
                height: {
                  type: 'number',
                },
                mimeType: {
                  type: 'string',
                },
                filesize: {
                  type: 'number',
                },
                filename: {
                  type: 'string',
                },
              },
              required: [],
            },
            portrait: {
              type: 'object',
              additionalProperties: false,
              properties: {
                url: {
                  type: 'string',
                },
                width: {
                  type: 'number',
                },
                height: {
                  type: 'number',
                },
                mimeType: {
                  type: 'string',
                },
                filesize: {
                  type: 'number',
                },
                filename: {
                  type: 'string',
                },
              },
              required: [],
            },
            square: {
              type: 'object',
              additionalProperties: false,
              properties: {
                url: {
                  type: 'string',
                },
                width: {
                  type: 'number',
                },
                height: {
                  type: 'number',
                },
                mimeType: {
                  type: 'string',
                },
                filesize: {
                  type: 'number',
                },
                filename: {
                  type: 'string',
                },
              },
              required: [],
            },
            feature: {
              type: 'object',
              additionalProperties: false,
              properties: {
                url: {
                  type: 'string',
                },
                width: {
                  type: 'number',
                },
                height: {
                  type: 'number',
                },
                mimeType: {
                  type: 'string',
                },
                filesize: {
                  type: 'number',
                },
                filename: {
                  type: 'string',
                },
              },
              required: [],
            },
            meta: {
              type: 'object',
              additionalProperties: false,
              properties: {
                url: {
                  type: 'string',
                },
                width: {
                  type: 'number',
                },
                height: {
                  type: 'number',
                },
                mimeType: {
                  type: 'string',
                },
                filesize: {
                  type: 'number',
                },
                filename: {
                  type: 'string',
                },
              },
              required: [],
            },
            hero: {
              type: 'object',
              additionalProperties: false,
              properties: {
                url: {
                  type: 'string',
                },
                width: {
                  type: 'number',
                },
                height: {
                  type: 'number',
                },
                mimeType: {
                  type: 'string',
                },
                filesize: {
                  type: 'number',
                },
                filename: {
                  type: 'string',
                },
              },
              required: [],
            },
          },
          required: [],
        },
        alt: {
          type: 'string',
        },
        fallback: {
          oneOf: [
            {
              type: 'string',
            },
            {
              $ref: '#/definitions/media',
            },
          ],
        },
      },
      required: ['alt'],
    },
    people: {
      title: 'Person',
      type: 'object',
      additionalProperties: false,
      properties: {
        name: {
          type: 'string',
        },
        position: {
          type: 'string',
        },
        contacts: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              type: {
                type: 'string',
                enum: ['mailto', 'tel', 'fax'],
              },
              label: {
                type: 'string',
              },
              value: {
                type: 'string',
              },
              id: {
                type: 'string',
              },
            },
            required: [],
          },
        },
        socialMediaLinks: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              type: {
                type: 'string',
                enum: ['facebook', 'vimeo', 'twitter', 'linkedin', 'instagram'],
              },
              url: {
                type: 'string',
              },
              id: {
                type: 'string',
              },
            },
            required: ['type', 'url'],
          },
        },
        richText: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        meta: {
          type: 'object',
          additionalProperties: false,
          properties: {
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            keywords: {
              type: 'string',
            },
            image: {
              oneOf: [
                {
                  type: 'string',
                },
                {
                  $ref: '#/definitions/media',
                },
              ],
            },
          },
          required: [],
        },
        slug: {
          type: 'string',
        },
        home: {
          oneOf: [
            {
              type: 'string',
            },
            {
              $ref: '#/definitions/pages',
            },
          ],
        },
      },
      required: ['name'],
    },
    forms: {
      title: 'Form',
      type: 'object',
      additionalProperties: false,
      properties: {
        title: {
          type: 'string',
        },
        emailTo: {
          type: 'string',
        },
        successMessage: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        redirect: {
          type: 'string',
        },
        submitButtonLabel: {
          type: 'string',
        },
        fields: {
          type: 'array',
          items: {
            oneOf: [
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  name: {
                    type: 'string',
                  },
                  label: {
                    type: 'string',
                  },
                  width: {
                    type: 'number',
                  },
                  defaultValue: {
                    type: 'string',
                  },
                  required: {
                    type: 'boolean',
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'text',
                  },
                },
                required: ['blockType', 'name', 'label'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  name: {
                    type: 'string',
                  },
                  label: {
                    type: 'string',
                  },
                  width: {
                    type: 'number',
                  },
                  defaultValue: {
                    type: 'string',
                  },
                  options: {
                    type: 'array',
                    items: {
                      type: 'object',
                      additionalProperties: false,
                      properties: {
                        label: {
                          type: 'string',
                        },
                        value: {
                          type: 'string',
                        },
                        id: {
                          type: 'string',
                        },
                      },
                      required: ['label', 'value'],
                    },
                  },
                  required: {
                    type: 'boolean',
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'select',
                  },
                },
                required: ['blockType', 'name', 'label'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  name: {
                    type: 'string',
                  },
                  label: {
                    type: 'string',
                  },
                  width: {
                    type: 'number',
                  },
                  required: {
                    type: 'boolean',
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'email',
                  },
                },
                required: ['blockType', 'name', 'label'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  name: {
                    type: 'string',
                  },
                  label: {
                    type: 'string',
                  },
                  width: {
                    type: 'number',
                  },
                  required: {
                    type: 'boolean',
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'state',
                  },
                },
                required: ['blockType', 'name', 'label'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  name: {
                    type: 'string',
                  },
                  label: {
                    type: 'string',
                  },
                  width: {
                    type: 'number',
                  },
                  required: {
                    type: 'boolean',
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'country',
                  },
                },
                required: ['blockType', 'name', 'label'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  name: {
                    type: 'string',
                  },
                  label: {
                    type: 'string',
                  },
                  width: {
                    type: 'number',
                  },
                  required: {
                    type: 'boolean',
                  },
                  defaultValue: {
                    type: 'boolean',
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'checkbox',
                  },
                },
                required: ['blockType', 'name', 'label'],
              },
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  message: {
                    type: 'array',
                    items: {
                      type: 'object',
                    },
                  },
                  id: {
                    type: 'string',
                  },
                  blockName: {
                    type: 'string',
                  },
                  blockType: {
                    const: 'message',
                  },
                },
                required: ['blockType'],
              },
            ],
          },
        },
      },
      required: ['title'],
    },
    'form-submissions': {
      title: 'Form Submission',
      type: 'object',
      additionalProperties: false,
      properties: {
        form: {
          oneOf: [
            {
              type: 'string',
            },
            {
              $ref: '#/definitions/forms',
            },
          ],
        },
        submissionData: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              field: {
                type: 'string',
              },
              value: {
                type: 'string',
              },
              id: {
                type: 'string',
              },
            },
            required: ['field', 'value'],
          },
        },
      },
      required: ['form'],
    },
    users: {
      title: 'User',
      type: 'object',
      additionalProperties: false,
      properties: {
        email: {
          type: 'string',
        },
        resetPasswordToken: {
          type: 'string',
        },
        resetPasswordExpiration: {
          type: 'string',
        },
        loginAttempts: {
          type: 'number',
        },
        lockUntil: {
          type: 'string',
        },
      },
      required: [],
    },
  },
  additionalProperties: false,
}

export const options = {
  unreachableDefinitions: true,
}
