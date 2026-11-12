function LaunchList({ launches, onLaunchHover, activeLaunchpadId }) {

    return (
        <aside className="aside" id="launchesContainer">
            <h3>Launches</h3>
            <div id="listContainer">
                <ul>
                    {launches.map(launch => {
                        const padId = launch.pad?.id;

                        const isActive = String(activeLaunchpadId) === String(padId) && activeLaunchpadId !== null;

                        return (
                            <li
                                key={launch.id}
                                className={isActive ? "active" : ""}
                                onMouseEnter={() => onLaunchHover(padId)}
                                onMouseLeave={() => onLaunchHover(null)}
                            >
                                {launch.name}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    )
}

export { LaunchList }
