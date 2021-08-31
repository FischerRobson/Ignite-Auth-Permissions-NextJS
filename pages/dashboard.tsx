import { Can } from "../components/Can";
import { useAuthContext } from "../contexts/AuthContext";
import { setupApiClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {

  const { user, signOut } = useAuthContext();

  return (
    <>
      <h1>Dashbaord</h1>

      <button onClick={signOut}>Sair</button>

      <Can permissions={["metrics.list"]}>
        <div>Métricas</div>
      </Can>

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