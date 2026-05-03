import type {StructureResolver} from 'sanity/structure'

const CONTACT_SINGLETON_ID = 'contact'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('curly')
    .items([
      S.listItem()
        .title('Globals')
        .child(
          S.list()
            .title('Globals')
            .items([
              S.listItem()
                .title('Contact')
                .child(S.document().schemaType('contact').documentId(CONTACT_SINGLETON_ID)),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title('Content')
        .child(
          S.list()
            .title('Content')
            .items([
              S.documentTypeListItem('caseStudy').title('Case Studies'),
              S.documentTypeListItem('job').title('Jobs'),
            ]),
        ),
    ])

