
module DatamedCustomComponents
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "0.0.1"

include("accordion.jl")
include("searchbar.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "datamed_custom_components",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "datamed_custom_components.min.js",
    external_url = nothing,
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "datamed_custom_components.min.js.map",
    external_url = nothing,
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end
