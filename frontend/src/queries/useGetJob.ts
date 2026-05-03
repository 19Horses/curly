import {useQuery, useQueryClient} from '@tanstack/react-query'
import axios from 'axios'
import {getApiUrl} from '../sanityIntegration'
import type {JobType} from './useGetJobs'

const getJobById = async (id: string): Promise<{result: JobType | null}> => {
  const query = `
    *[_type == 'job' && _id == ${JSON.stringify(id)}][0]{
      _id,
      title,
      overview,
      responsibilities,
      annualLeave,
      salary,
      details,
      applicationDeadline
    }
  `
  const response = await axios.get(getApiUrl(query))
  return response.data
}

export const useGetJob = (id: string | undefined) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['job', id],
    queryFn: () => getJobById(id as string),
    enabled: Boolean(id),
    initialData: () => {
      if (!id) return undefined
      const list = queryClient.getQueryData<JobType[]>(['jobs'])
      if (!list) return undefined
      const hit = list.find((job) => job._id === id)
      return hit ? {result: hit} : undefined
    },
    initialDataUpdatedAt: () => queryClient.getQueryState(['jobs'])?.dataUpdatedAt,
    select: (res) => res.result,
  })
}

