import { eatoolApi } from '@/api/eatoolApi'


export const getTokenActions = async () => {
    const{ data } = await eatoolApi.post('/user/token/');
  return data

}
