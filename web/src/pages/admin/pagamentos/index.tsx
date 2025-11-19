import translatePaymentStatus from "@/common/helpers/translate-payment-status";
import { useGetPaginatedPayments } from "@/hooks/admin/get-payments.hook";
import currencyFormatter from "@/lib/currency-formatter";
import mmt from "@/lib/mmt";
import { Card } from "@nextui-org/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";
import { AlertCircle, Eye } from "lucide-react";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import { PaymentStatus } from "@/common/enum/payment-status.enum";
import PreviewPayment from "@/components/admin/preview-payment";
import ForcePayment from "@/components/admin/force-payment";
import useDebounce from "@/common/helpers/debouce-helper";

export function Home() {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isForceModalOpen, setIsForceModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>();
  const [name, setName] = useState("");
  const debouncedSearch = useDebounce(name, 500);

  const { payments, page, setPage, total, perPage, refetch } =
    useGetPaginatedPayments(debouncedSearch);

  const pages = Math.ceil(total / perPage);
  return (
    <div className="w-full h-min rounded-xl flex justify-center">
      {selectedPaymentId && (
        <>
          <PreviewPayment
            isOpen={isPreviewModalOpen}
            closeModal={() => setIsPreviewModalOpen(false)}
            paymentId={selectedPaymentId ?? ""}
          />
          <ForcePayment
            isOpen={isForceModalOpen}
            closeModal={() => setIsForceModalOpen(false)}
            paymentId={selectedPaymentId ?? ""}
            onUpdate={async () => {
              await refetch();
            }}
          />
        </>
      )}
      <Card
        isBlurred
        className="flex space-y-4 max-w-7xl p-8 justify-center items-center w-full"
      >
        <div className="w-full flex flex-row justify-between">
          <span className="text-2xl w-1/2 text-end">Pagamentos</span>
          <Input
            className="w-[300px]"
            value={name}
            label="Pesquisar por ID, Nome ou Telefone"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Table
          className="max-w-3x w-full"
          bottomContent={
            pages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>Valor</TableColumn>
            <TableColumn>Nome comprador</TableColumn>
            <TableColumn>Telefone comprador</TableColumn>
            <TableColumn>Criada em </TableColumn>

            <TableColumn>Pago em</TableColumn>
            <TableColumn>Status</TableColumn>

            <TableColumn>Ações</TableColumn>
          </TableHeader>
          <TableBody>
            {payments
              ? payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>
                      {currencyFormatter.format(payment.value)}
                    </TableCell>
                    <TableCell>{payment.commonUser.name}</TableCell>
                    <TableCell>{payment.commonUser.phone}</TableCell>
                    <TableCell>
                      {mmt(payment.created_at).format("DD-MM-YYYY HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      {payment.paid_at
                        ? mmt(payment.paid_at).format("DD-MM-YYYY HH:mm:ss")
                        : "EM ABERTO"}
                    </TableCell>
                    <TableCell>
                      {translatePaymentStatus(payment.status)}
                    </TableCell>
                    <TableCell className="flex flex-row space-x-2">
                      <div
                        onClick={() => {
                          setSelectedPaymentId(payment.id);
                          setIsPreviewModalOpen(true);
                        }}
                        className="cursor-pointer transition-all hover:text-green-500"
                      >
                        <Eye />
                      </div>
                      {payment.status === PaymentStatus.PENDING && (
                        <div
                          onClick={() => {
                            setSelectedPaymentId(payment.id);
                            setIsForceModalOpen(true);
                          }}
                          className="cursor-pointer transition-all hover:text-red-500"
                        >
                          <AlertCircle />
                        </div>
                      )}{" "}
                    </TableCell>
                  </TableRow>
                ))
              : []}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
export default Home;
