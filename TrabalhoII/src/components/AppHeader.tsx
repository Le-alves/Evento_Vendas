import Menu from "./Menu";

interface AppHeaderInterface {
    title?: string;
}

const AppHeader = ({ title }: AppHeaderInterface) => {

    let renderTitle
    if (title !== undefined) {
        renderTitle =
            <div className="flex justify-center mt-4">
                <h2 className="text-xl font-bold">{title}</h2>
            </div>
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-600"></div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">
                            Sistema de Vendas de Ingressos
                        </h1>
                    </div>
                    <Menu />
                </div>
            </header>
            {renderTitle}
        </>
    )

}

export default AppHeader