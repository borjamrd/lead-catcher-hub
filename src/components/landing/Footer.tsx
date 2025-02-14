
const Footer = () => {
  return (
    <footer className="bg-rich_black text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              <span className="text-yinmn_blue">oposita</span>
              <span className="text-oxford_blue">place</span>
            </h3>
            <p className="text-sm">
              La plataforma integral para opositores.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-medium">Funcionalidades</h4>
            <ul className="space-y-2 text-sm">
              <li>Avisos INAP</li>
              <li>Tests Gratuitos</li>
              <li>Chat Jurídico</li>
              <li>Notas y apuntes</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-medium">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>Términos y condiciones</li>
              <li>Política de privacidad</li>
              <li>Aviso legal</li>
              <li>Cookies</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-medium">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>Soporte</li>
              <li>Contacto</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} opositaplace. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
