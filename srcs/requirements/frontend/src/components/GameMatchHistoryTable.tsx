import { Table } from "flowbite-react";
import moment from "moment";
import { GameResult, IHistory } from "../recoil/socketType";

type GameMatchHistoryTableProps = {
  matchHistory: IHistory[];
}
/*
begin: "2022-11-11T08:05:39.560Z"
end: "2022-11-11T08:06:22.943Z"
enemy: "seongcho"
login: "indivisibilibus@gmail.com"
result: 1
*/

export const GameMatchHistoryTable: React.FC<GameMatchHistoryTableProps> = ({matchHistory}) => {
  //2022-11-14T07:05:32.098Z
  const dateString =  (dateStr : string) => {
    const date = new Date(dateStr);
    return moment(date).format('YYYY-MM-DD hh:mm:ss a')
  }

  return (
    <div className="">

    <Table striped>
      <Table.Head>
        <Table.HeadCell>Opponent</Table.HeadCell>
        <Table.HeadCell>Result</Table.HeadCell>
        <Table.HeadCell>When</Table.HeadCell>
      </Table.Head>

      <Table.Body className="divide-y">

        {matchHistory.map((match, index)=> (
          <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">

            <Table.Cell>{match.enemy}</Table.Cell>
            <Table.Cell>{GameResult[match.result]}</Table.Cell>
            <Table.Cell>{dateString(match.end as string)}</Table.Cell>

          </Table.Row>
        ))}

      </Table.Body>
    </Table>


  </div>);
}

