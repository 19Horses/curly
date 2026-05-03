import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getApiUrl } from '../sanityIntegration';

export type JobType = {
  _id: string;
  title: string;
  overview: unknown[];
  responsibilities: string[];
  annualLeave: string;
  salary: string;
  details: unknown[];
  applicationDeadline: string;
};

const query = `
  *[_type == 'job'] | order(applicationDeadline desc){
    _id,
    title,
    overview,
    responsibilities,
    annualLeave,
    salary,
    details,
    applicationDeadline
  }
`;

const getJobs = async (): Promise<{ result: JobType[] }> => {
  const response = await axios.get(getApiUrl(query));
  return response.data;
};

export const useGetJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs,
    select: (res) => res.result,
  });
};
