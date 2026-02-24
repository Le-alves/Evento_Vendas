import { Link } from "react-router-dom"

const Menu = () => {

    const cssMenu = "text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"

    return (
        <nav className="flex gap-4">
            <Link to="/" className={cssMenu}>Home</Link>
            <Link to="/events/create" className={cssMenu}>Cadastro Eventos</Link>
            <Link to="/events" className={cssMenu}>Lista Eventos</Link>
            <Link to="/sales" className={cssMenu}>Lista Vendas</Link>
            <Link to="/sales/create" className={cssMenu}>Cadastro Venda</Link>
            <Link to="/sales/update-status" className={cssMenu}>Alterar Status</Link>
        </nav>
    )

}

export default Menu