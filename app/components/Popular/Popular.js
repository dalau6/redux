import React from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from 'utils/api'
import Loading from '../Loading/Loading'
import './styles.css'

function SelectLanguage({ selectedLanguage, onSelect }) {
  const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']
  return (
    <ul className='languages'>
      {languages.map((lang) => (
        <li
          style={lang === selectedLanguage ? { color: '#4a90e2' } : null}
          onClick={() => onSelect(lang)}
          key={lang}>
          {lang}
        </li>
      ))}
    </ul>
  )
}

function RepoGrid({ repos }) {
  return (
    <ul className='popular-list'>
      {repos.map(({ name, stargazers_count, owner, html_url }, index) => (
        <li key={name} className='popular-item'>
          <div className='popular-rank'>#{index + 1}</div>
          <ul className='space-list-items'>
            <li>
              <img
                className='avatar'
                src={owner.avatar_url}
                alt={'Avatar for ' + owner.login}
              />
            </li>
            <li><a href={html_url}>{name}</a></li>
            <li>@{owner.login}</li>
            <li>{stargazers_count} stars</li>
          </ul>
        </li>
      ))}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired,
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
}

class Popular extends React.Component {
  state = {
    selectedLanguage: 'All',
    repos: null,
  }
  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage)
  }
  updateLanguage = async (lang) => {
    this.setState(() => ({
      selectedLanguage: lang,
      repos: null
    }))

    const repos = await fetchPopularRepos(lang)
    this.setState(() => ({ repos }))
    this.props.onFetch()
  }

  render() {
    const { selectedLanguage, repos } = this.state
    return (
      <div>
        {this.props.isFetching
          ? <p> LOAD </p>
          : <p> NO LOAD </p>
        }
        <SelectLanguage
          selectedLanguage={selectedLanguage}
          onSelect={this.updateLanguage} />
        {!repos
          ? <Loading />
          : <RepoGrid repos={repos} />}
      </div>
    )
  }
}

Popular.propTypes = {
  onFetch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
}

export default Popular