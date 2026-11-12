import { LaunchList } from "./launchList";
import { Map } from "./map";
import { useEffect, useState } from "react";
import { SpaceX } from "../api/spacex";

function App() {

    const [launches, setLaunches] = useState([]);
    const [launchpads, setLaunchpads] = useState([]);
    const [activeLaunchpadId, setActiveLaunchpadId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const spacex = new SpaceX();
        let cancelled = false;

        async function loadData() {
            try {
                const [allLaunches, allLaunchpads] = await Promise.all([
                    spacex.launches(),
                    spacex.launchpads()
                ]);

                if (cancelled) return;
                
                const pads = allLaunchpads.filter(pad =>pad.latitude != null && pad.longitude != null);
                const padIds = new Set(pads.map(pad => String(pad.id)));
                const spaceXLaunches = allLaunches.filter(launch =>padIds.has(String(launch.pad?.id)));
                const usedIds = new Set(spaceXLaunches.map(launch => String(launch.pad.id)));
                const usedPads = pads.filter(pad =>usedIds.has(String(pad.id)));

                setLaunches(spaceXLaunches);
                setLaunchpads(usedPads);

            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => { cancelled = true; };
    }, []);

    if (loading) {
        return <main>Loading...</main>;
    }

    if (error) {
        return <main>Error: {error}</main>;
    }

    return (
        <main className="main">
            <LaunchList
                launches={launches}
                activeLaunchpadId={activeLaunchpadId}
                onLaunchHover={setActiveLaunchpadId}
            />

            <Map
                launchpads={launchpads}
                activeLaunchpadId={activeLaunchpadId}
            />
        </main>
    )
}

export { App };
