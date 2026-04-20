import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllContests, fetchSolution, addSolution } from "../lib/api";

export const useContests = () =>
    useQuery({
        queryKey: ["contests", "all"],
        queryFn: fetchAllContests,
        refetchInterval: 10 * 60 * 1000,
    });

export const useSolution = (contestId, enabled = true) =>
    useQuery({
        queryKey: ["solution", contestId],
        queryFn: () => fetchSolution(contestId),
        enabled: Boolean(contestId) && enabled,
        staleTime: 10 * 60 * 1000,
    });

export const useAddSolution = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: addSolution,
        onSuccess: (_, vars) => {
            qc.setQueryData(["solution", vars.contestId], vars.solutionLink);
        },
    });
};
