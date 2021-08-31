import { useAuthContext } from "../contexts/AuthContext";
import { useCan } from "../hooks/useCan";
import { setupApiClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {

  const { user } = useAuthContext();

  const useCanSeeMetrics = useCan({
    permissions: ['metrics.list']
  });

  return (
    <>
      <h1>Dashbaord</h1>

      {useCanSeeMetrics && (
        <div>Métricas</div>
      )}
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx);
  const response = await apiClient.get("/me");

  return {
    props: {},
  }
})