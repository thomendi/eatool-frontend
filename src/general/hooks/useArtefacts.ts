import { useQuery } from '@tanstack/react-query';
import { getArtefactsActions } from '../actions/get-artefacts.actions';
import { getArtefactsSubtypeListActions } from '../actions/get-artefacts-subtype-list.actions';


export const useArtefacts = (subtype: string = 'Proceso') => {
    return useQuery({
        queryKey: ['artefacts', subtype],
        queryFn: () => getArtefactsSubtypeListActions(subtype),
    });
};
