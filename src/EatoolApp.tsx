
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router'
import { appRouter } from './app.router'
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();


export const EatoolApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router= { appRouter} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )



};
