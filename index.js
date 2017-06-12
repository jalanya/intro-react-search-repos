class FormularioBusqueda extends React.Component {
  constructor(props){
    super();
    this.state = {
      usuario: props.usuario,
      incluirMiembro: props.incluirMiembro
    };
  }

  handleSubmit(ev) {
    ev.preventDefault();
    this.props.onBuscar({
      usuario: this.state.usuario,
      incluirMiembro: this.state.incluirMiembro
    });
  }

  handleUsuario(ev) {
    this.setState({ usuario: ev.target.value });
  }

  handleIncluirMiembro(ev) {
    this.setState({ incluirMiembro: ev.target.checked });
  }

  render() {
    return <form className="formulario-busqueda" onSubmit={this.handleSubmit.bind(this)}>
      <input
        className="input-usuario"
        type="text"
        value={this.state.usuario}
        onChange={this.handleUsuario.bind(this)}
      />
      <button className="formluario-submit" type="submit">Buscar</button>
      <label className="check-miembro">
        <input
          type="checkbox"
          checked={this.state.incluirMiembro}
          onChange={this.handleIncluirMiembro.bind(this)}
        /> Incluir repositorios donde el usuario es miembro.
      </label>
    </form>;
  }
}
class ItemResultado extends React.Component {
  render() {
    var resultado = this.props.resultado;
    return <li className="resultado">
      <h3>
        <a href={resultado.html_url} target="_blank">
          {resultado.name}
        </a> {resultado.private && <span className="resultado-privado">Privados</span>}
      </h3>
      <p className="resultado-info">
        {resultado.fork && <span className="resultado-fork">
          <i className="fa fa-code-fork"/> Forkeado
          </span>}
      </p>
      <p className="resultado-descripcion">{resultado.description}</p>
      <p className="resultado-actualizado">Actualizado {moment(resultado.updated_at).fromNow()}</p>
      <div className="resultado-stats">
        <span className="resultado-stat">
          {resultado.language}
        </span>
        <span className="resultado-stat">
          <i className="fa fa-code-fork" /> {resultado.forks_count}
        </span>
        <span className="resultado-stat">
          <i className="fa fa-star" /> {resultado.stargazers_count}
        </span>
        <span className="resultado-stat">
          <i className="fa fa-eye" /> {resultado.watchers_count}
        </span>
      </div>
    </li>;
  }
}

class Resultados extends React.Component {
  render() {
    return <ul className="resultados-lista">
      {this.props.resultados.map(function(resultado) {
        return <ItemResultado key={resultado.id} resultado={resultado} />;
      }.bind(this))}
    </ul>;
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      resultados: [],
      usuario: 'jalanya',
      incluirMiembro: false
    };
  }

  componentDidMount() {
    this.buscarResultados(this.state);
  }

  buscarResultados(params) {
    var url = 'https://api.github.com/users/' + params.usuario + '/repos?sort=updated';
    if (params.incluirMiembro) {
      url += '&type=all';
    }

    fetch(url).then(function(response) {
        if (response.ok) {
          response.json().then(function(body) {
            this.setState({ resultados: body });
          }.bind(this));
        } else {
          this.state({ resultados: []})
        }
    }.bind(this));
  }

  cambiarCriterioBusqueda(state) {
    this.setState(state);
    this.buscarResultados(state);
  }

  render() {
    return <div className="app">
      <FormularioBusqueda
        usuario={this.state.usuario}
        incluirMiembro={this.state.incluirMiembro}
        onBuscar={this.cambiarCriterioBusqueda.bind(this)}
      />
      <Resultados resultados={this.state.resultados} />
    </div>;
  }
}

ReactDOM.render(<App />, document.getElementById("content"));
