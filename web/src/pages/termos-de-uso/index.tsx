import { Card } from "@nextui-org/card";

export default function TermsOfUsePage() {
  return (
    <div className="bg-black/65 rounded-xl">
      <Card isBlurred className="p-8 items-center space-y-4">
        <span className="font-bold text-xl">TERMOS DE UTILIZAÇÃO</span>
        <ul className="space-y-4">
          <li>
            <span className="font-bold">1. Aceitação dos Termos:</span>
            <span className="block">
              (ii) Concordo com os Termos de Uso e a Política de Privacidade do
              site.
            </span>
          </li>
          <li>
            <span className="font-bold">2. Informações sobre Sorteios:</span>
            <span className="block">
              Os sorteios serão realizados nas datas e condições especificadas
              nas Condições Gerais do Título de Capitalização. Todos os
              participantes serão informados previamente sobre os detalhes dos
              sorteios através do site oficial e/ou redes sociais cadastrados.
            </span>
          </li>

          <li>
            <span className="font-bold">
              3. Privacidade e Proteção de Dados:
            </span>
            <span className="block">
              Comprometemo-nos a proteger as informações pessoais dos
              subscritores em conformidade com a legislação vigente sobre
              proteção de dados. Detalhes sobre o tratamento de dados pessoais
              estão disponíveis em nossa Política de Privacidade.{" "}
            </span>
          </li>
          <li>
            <span className="font-bold">4. Alterações nos Termos de Uso:</span>
            <span className="block">
              Reservamo-nos o direito de alterar estes Termos de Uso a qualquer
              momento. Quaisquer alterações entrarão em vigor imediatamente após
              sua publicação no site. Recomenda-se que os subscritores revisem
              os termos regularmente para se manterem informados sobre quaisquer
              mudanças.
            </span>
          </li>
          <li>
            <span className="font-bold">5. Disposições Gerais:</span>
            <span className="block mb-2">
              Em caso de questões não resolvidas pelos Termos de Uso, as partes
              concordam em submeter-se à jurisdição exclusiva dos tribunais
              competentes para resolver tais questões e os envolvidos na criação
              e administração da plataforma serão previamente comunicados.
            </span>
            <span className="block">
              Este Título de Capitalização não confere ao subscritor qualquer
              participação societária nas empresas envolvidas, sendo
              exclusivamente um produto de natureza lotérica.
            </span>
          </li>
          <div className="font-bold">
            Administração da plataforma realizada por sortelancada.com
          </div>
        </ul>
      </Card>
    </div>
  );
}
