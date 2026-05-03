import {useQuery, useQueryClient} from '@tanstack/react-query'
import axios from 'axios'
import {getApiUrl} from '../sanityIntegration'
import type {CaseStudyType} from './useGetCaseStudies'

const getCaseStudyById = async (id: string): Promise<{result: CaseStudyType | null}> => {
  const query = `
    *[_type == 'caseStudy' && _id == ${JSON.stringify(id)}][0]{
      _id,
      client,
      title,
      brief,
      approach,
      results,
      images[]{
        alt,
        "url": asset->url
      },
      videoLink
    }
  `
  const response = await axios.get(getApiUrl(query))
  return response.data
}

export const useGetCaseStudy = (id: string | undefined) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['caseStudy', id],
    queryFn: () => getCaseStudyById(id as string),
    enabled: Boolean(id),
    initialData: () => {
      if (!id) return undefined
      const list = queryClient.getQueryData<CaseStudyType[]>(['caseStudies'])
      if (!list) return undefined
      const hit = list.find((cs) => cs._id === id)
      return hit ? {result: hit} : undefined
    },
    initialDataUpdatedAt: () => queryClient.getQueryState(['caseStudies'])?.dataUpdatedAt,
    select: (res) => res.result,
  })
}

