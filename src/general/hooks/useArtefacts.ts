import { useQuery } from '@tanstack/react-query';
import { getArtefactsActions } from '../actions/get-artefacts.actions';

export const useArtefacts = () => {
    // Todo: viene logica

    return useQuery({
        queryKey: ['artefacts'],
        queryFn: getArtefactsActions,
    });
};
