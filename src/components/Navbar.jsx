import dayjs from "dayjs";



import { navIcons, navLinks } from '#constants';

const Navbar = () => {
    return (
    <nav>
        <div>
            <img src="/images/logo.svg" alt="logo" />
            <p className="font-bold">Asif's Portfolio</p>
            <ul>
                {navLinks.map(({ id, name }) => (
                    <li key={id}>
                        <p>{name}</p>
                    </li>
                ))}
            </ul>
        </div>
        <div>
            <ul>
                {
                    navIcons.map(({id,img})=>(
                        <li key={id}>
                            <img src={img} alt={name} className='icons-hover' />
                        </li>
                    ))
                }
            </ul>
        </div>
        <time datetime="">{dayjs().format('ddd-MM-D h:mm A')}</time>
    </nav>
    )
};
export default Navbar;