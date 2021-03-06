import humanize from 'humanize-string'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { Link, routes } from '@redwoodjs/router'

import { QUERY } from 'src/components/TripsOnUsers/TripsOnUsersesCell'

const DELETE_TRIPS_ON_USERS_MUTATION = gql`
  mutation DeleteTripsOnUsersMutation($id: Int!) {
    deleteTripsOnUsers(id: $id) {
      id
    }
  }
`

const MAX_STRING_LENGTH = 150

const formatEnum = (values: string | string[] | null | undefined) => {
  if (values) {
    if (Array.isArray(values)) {
      const humanizedValues = values.map((value) => humanize(value))
      return humanizedValues.join(', ')
    } else {
      return humanize(values as string)
    }
  }
}

const truncate = (text) => {
  let output = text
  if (text && text.length > MAX_STRING_LENGTH) {
    output = output.substring(0, MAX_STRING_LENGTH) + '...'
  }
  return output
}

const jsonTruncate = (obj) => {
  return truncate(JSON.stringify(obj, null, 2))
}

const timeTag = (datetime) => {
  return (
    datetime && (
      <time dateTime={datetime} title={datetime}>
        {new Date(datetime).toUTCString()}
      </time>
    )
  )
}

const checkboxInputTag = (checked) => {
  return <input type="checkbox" checked={checked} disabled />
}

const TripsOnUsersesList = ({ tripsOnUserses }) => {
  const [deleteTripsOnUsers] = useMutation(DELETE_TRIPS_ON_USERS_MUTATION, {
    onCompleted: () => {
      toast.success('TripsOnUsers deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete tripsOnUsers ' + id + '?')) {
      deleteTripsOnUsers({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>User id</th>
            <th>Trip id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {tripsOnUserses.map((tripsOnUsers) => (
            <tr key={tripsOnUsers.id}>
              <td>{truncate(tripsOnUsers.id)}</td>
              <td>{truncate(tripsOnUsers.userId)}</td>
              <td>{truncate(tripsOnUsers.tripId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.tripsOnUsers({ id: tripsOnUsers.id })}
                    title={'Show tripsOnUsers ' + tripsOnUsers.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editTripsOnUsers({ id: tripsOnUsers.id })}
                    title={'Edit tripsOnUsers ' + tripsOnUsers.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete tripsOnUsers ' + tripsOnUsers.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(tripsOnUsers.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TripsOnUsersesList
