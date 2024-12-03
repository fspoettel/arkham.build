import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import { selectAvailableConnections } from "@/store/selectors/connections";
import { selectConnectionLock } from "@/store/selectors/shared";
import type { Connection, Provider } from "@/store/slices/connections.types";
import { cx } from "@/utils/cx";
import { capitalize, formatDate } from "@/utils/formatting";
import { CheckIcon, CloudOffIcon } from "lucide-react";
import css from "./connections.module.css";

export function Connections() {
  const connections = useStore((state) => state.connections);

  return (
    <>
      {selectAvailableConnections().map((provider) => {
        const connection: Connection | undefined = connections.data?.[provider];

        return (
          <article className={css["connection"]} key={provider}>
            <header className={css["header"]}>
              <h3 className={css["title"]}>
                <i className="icon-elder_sign" />
                ArkhamDB
              </h3>
              {connection?.status && (
                <ConnectionStatusOutput connection={connection} />
              )}
            </header>
            <div className={css["content"]}>
              {connection != null ? (
                <ConnectionDetails
                  connection={connection}
                  lastSyncedAt={connections.lastSyncedAt}
                />
              ) : (
                <ConnectionInit provider={provider} />
              )}
            </div>
          </article>
        );
      })}
    </>
  );
}

function ConnectionStatusOutput(props: {
  connection: Connection;
}) {
  const { status } = props.connection;

  return (
    <output className={css["status"]}>
      <span className={cx(css["status-icon"], css[status])}>
        {status === "connected" && <CheckIcon />}
        {status === "disconnected" && <CloudOffIcon />}
      </span>
      <span>
        {status === "connected" && "Connected"}
        {status === "disconnected" &&
          "There is a problem with this connection, please reconnect."}
      </span>
    </output>
  );
}

function ConnectionDetails(props: {
  connection: Connection;
  lastSyncedAt?: number;
}) {
  const { connection, lastSyncedAt } = props;
  const removeConnection = useStore((state) => state.removeConnection);

  const connectionLock = useStore(selectConnectionLock);

  return (
    <>
      <details className={css["details"]}>
        <summary>Details</summary>
        <dl className={css["details-properties"]}>
          {connection.user.username && (
            <>
              <dt>Username</dt>
              <dd>{connection.user.username}</dd>
            </>
          )}
          {connection.user.id && (
            <>
              <dt>User id</dt>
              <dd>{connection.user.id}</dd>
            </>
          )}
          <dt>Connected since</dt>
          <dd>{formatDate(connection.createdAt)}</dd>
          <dt>Last sync</dt>
          <dd>
            {lastSyncedAt ? new Date(lastSyncedAt).toUTCString() : "Never"}
          </dd>

          {connection.syncDetails && (
            <>
              <dt>Sync status</dt>
              <dd>{capitalize(connection.syncDetails.status)}</dd>
              {connection.syncDetails.status === "success" && (
                <>
                  <dt>Sync items</dt>
                  <dd>
                    {connection.syncDetails.itemsSynced} /{" "}
                    {connection.syncDetails.itemsTotal}
                  </dd>
                  <dt>Data timestamp</dt>
                  <dd>{connection.syncDetails.lastModified}</dd>
                </>
              )}
              <dt>Sync errors</dt>
              <dd>
                {connection.syncDetails?.errors?.length
                  ? connection.syncDetails.errors.join(", ")
                  : "No errors"}
              </dd>
            </>
          )}
        </dl>
      </details>
      <div className={css["actions"]}>
        <Button
          as="a"
          disabled={!!connectionLock}
          href={`${import.meta.env.VITE_API_URL}/auth/signin?provider=${connection.provider}`}
          type="button"
        >
          Refresh connection
        </Button>
        <Button
          type="button"
          disabled={!!connectionLock}
          onClick={() => removeConnection(connection.provider as Provider)}
        >
          Disconnect
        </Button>
      </div>
    </>
  );
}

function ConnectionInit(props: {
  provider: Provider;
}) {
  const { provider } = props;

  return (
    <>
      <p className={css["info-text"]}>
        Connect your {provider} account to sync your decks.
      </p>
      <div className={css["actions"]}>
        <Button
          as="a"
          href={`${import.meta.env.VITE_API_URL}/auth/signin?provider=${provider}`}
          type="button"
        >
          Connect
        </Button>
      </div>
    </>
  );
}
